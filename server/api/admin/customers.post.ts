import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateCustomerPayload } from '@/types/admin'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateCustomerPayload>(event)
  const errors: string[] = []

  if (!body.name) errors.push('Name is required')
  if (!body.email) errors.push('Email is required')
  if (!body.username) errors.push('Username is required')
  if (!body.password) errors.push('Password is required')

  if (typeof body.costPerMinute !== 'number' || Number.isNaN(body.costPerMinute)) {
    errors.push('Cost per minute must be a valid number')
  }

  if (errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join(', ') })
  }

  const config = useRuntimeConfig()
  if (!config?.airtable?.apiKey || !config?.airtable?.baseId) {
    throw createError({ statusCode: 500, statusMessage: 'Airtable credentials not configured' })
  }

  const apiKey: string = config.airtable.apiKey
  const baseId: string = config.airtable.baseId
  const tableName: string = config.airtable.tableName || 'Customers'

  const sanitizedUsername = body.username.trim()
  const sanitizedEmail = body.email.trim()

  const escapeFormulaValue = (value: string) => value.replace(/'/g, "\\'")

  async function checkExisting(fieldName: string, value: string) {
    const filter = `{${fieldName}}='${escapeFormulaValue(value)}'`
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`)
    url.searchParams.set('filterByFormula', filter)
    url.searchParams.set('maxRecords', '1')
    const resp = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!resp.ok) {
      throw createError({
        statusCode: resp.status,
        statusMessage: 'Failed to validate existing records',
      })
    }
    const data = await resp.json()
    return Array.isArray(data.records) && data.records.length > 0
  }

  if (await checkExisting('Username', sanitizedUsername)) {
    throw createError({ statusCode: 409, statusMessage: 'Username is already in use' })
  }
  if (await checkExisting('Email', sanitizedEmail)) {
    throw createError({ statusCode: 409, statusMessage: 'Email address is already in use' })
  }

  const commissionRate =
    typeof body.commissionPerMinute === 'number' && !Number.isNaN(body.commissionPerMinute)
      ? body.commissionPerMinute
      : 0.04

  const fields: Record<string, any> = {
    Name: body.name,
    Email: sanitizedEmail,
    Username: sanitizedUsername,
    Password: body.password,
    ['Cost per Minute']: Number(body.costPerMinute),
    ['Commission Rate (Euro per Minute)']: commissionRate,
  }

  if (body.trunkId) {
    fields['Trunk ID'] = body.trunkId
  }
  if (body.openAiProjectId) {
    fields['OpenAI Project ID'] = body.openAiProjectId
  }

  const resp = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields,
      }),
    }
  )

  if (!resp.ok) {
    let errorMessage: string | undefined
    try {
      const data = await resp.json()
      errorMessage = data?.error?.message || JSON.stringify(data)
    } catch (err) {
      errorMessage = (err as Error).message
    }
    throw createError({
      statusCode: resp.status,
      statusMessage: 'Failed to create customer',
      message: errorMessage,
    })
  }

  const created = await resp.json()

  return {
    success: true,
    record: created,
  }
})
