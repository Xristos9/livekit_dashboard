<script setup lang="ts">
import { Icon } from '@iconify/vue'
definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Abyssaltech.AI - AI Customer Service Dashboard',
  meta: [
    {
      name: 'description',
      content:
        'Monitor and optimize your AI customer service agents with real-time analytics, performance insights, and comprehensive reporting.',
    },
  ],
})

const features = ref([
  {
    icon: 'solar:chart-line-duotone',
    title: 'Real-time Analytics',
    description:
      'Monitor your AI agents performance with live metrics, response times, and customer satisfaction scores.',
  },
  {
    icon: 'solar:users-group-two-rounded-line-duotone',
    title: 'Agent Management',
    description:
      'Manage multiple AI agents, track their conversations, and optimize their responses for better customer experience.',
  },
  {
    icon: 'solar:dollar-minimalistic-line-duotone',
    title: 'Cost Optimization',
    description:
      'Track API costs, token usage, and optimize your AI spending with detailed cost breakdowns and forecasting.',
  },
  {
    icon: 'solar:shield-check-line-duotone',
    title: 'Quality Assurance',
    description:
      'Ensure consistent service quality with automated monitoring, conversation analysis, and performance alerts.',
  },
  {
    icon: 'solar:phone-calling-rounded-line-duotone',
    title: 'Call Recording',
    description:
      'Record and analyze customer calls with AI-powered transcription and sentiment analysis for continuous improvement.',
  },
  {
    icon: 'solar:graph-new-up-line-duotone',
    title: 'Performance Insights',
    description:
      'Get actionable insights from conversation data to improve agent responses and customer satisfaction rates.',
  },
])

const stats = ref([
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '1s', label: 'Avg Response Time' },
  { value: '2+', label: 'Active Agents' },
  { value: '100+', label: 'Conversations Handled' },
])

const testimonials = ref([
  {
    quote:
      'Abyssaltech.AI transformed our customer service. Our response times improved by 80% and customer satisfaction scores increased dramatically.',
    author: 'Sarah Johnson',
    role: 'Customer Success Director',
    company: 'TechCorp Solutions',
    avatar: '/images/profile/user-1.jpg',
  },
  {
    quote:
      'The analytics dashboard gives us incredible insights into our AI agents performance. We can now optimize conversations in real-time.',
    author: 'Michael Chen',
    role: 'Operations Manager',
    company: 'Global Services Inc',
    avatar: '/images/profile/user-2.jpg',
  },
  {
    quote:
      'Cost tracking and optimization features helped us reduce our AI operational costs by 40% while improving service quality.',
    author: 'Emily Rodriguez',
    role: 'CTO',
    company: 'StartupXYZ',
    avatar: '/images/profile/user-3.jpg',
  },
])
</script>

<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="header-content">
          <div class="logo">
            <NuxtLink to="/">
              <img src="/images/logos/abyssaltech_logo_black.png" alt="Abyssaltech.AI" />
            </NuxtLink>
          </div>
          <nav class="navigation">
            <NuxtLink to="#features" class="nav-link">Features</NuxtLink>
            <NuxtLink to="#pricing" class="nav-link">Pricing</NuxtLink>
            <NuxtLink to="#about" class="nav-link">About</NuxtLink>
            <NuxtLink to="#contact" class="nav-link">Contact</NuxtLink>
          </nav>
          <div class="header-actions">
            <NuxtLink to="/auth/login" class="login-btn">Log in</NuxtLink>
            <NuxtLink to="/auth/register" class="signup-btn">Get Started</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">Revolutionize</span> Your Customer Service with AI
              Intelligence
            </h1>
            <p class="hero-subtitle">
              Monitor, analyze, and optimize your AI customer service agents with our comprehensive
              dashboard. Get real-time insights, track performance metrics, and ensure exceptional
              customer experiences.
            </p>
            <div class="hero-stats">
              <div class="stat-avatars">
                <v-avatar v-for="i in 3" :key="i" size="40" class="avatar-border">
                  <img :src="`/images/profile/user-${i}.jpg`" :alt="`User ${i}`" height="40" />
                </v-avatar>
              </div>
              <div class="stat-text">
                <h6 class="stat-number">1+</h6>
                <p class="stat-label">teams manage AI agents with our platform</p>
              </div>
            </div>
            <div class="hero-actions">
              <NuxtLink to="/auth/register" class="primary-btn"> Start Free Trial </NuxtLink>
              <NuxtLink to="/auth/login" class="secondary-btn"> View Demo </NuxtLink>
            </div>
          </div>
          <div class="hero-visual">
            <div class="dashboard-preview">
              <div class="preview-header">
                <div class="preview-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <span class="preview-title">AI Dashboard</span>
              </div>
              <div class="preview-content">
                <div class="metric-card">
                  <div class="metric-label">Active Agents</div>
                  <div class="metric-value">24</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Avg Response</div>
                  <div class="metric-value">1.2s</div>
                </div>
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="features-container">
        <div class="section-header">
          <h2 class="section-title">Powerful Features for AI Excellence</h2>
          <p class="section-subtitle">
            Everything you need to monitor, manage, and optimize your AI customer service agents in
            one comprehensive platform.
          </p>
        </div>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon">
              <Icon :icon="feature.icon" height="32" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="testimonials-container">
        <div class="section-header">
          <h2 class="section-title">Trusted by Industry Leaders</h2>
          <p class="section-subtitle">
            See how companies worldwide are transforming their customer service with our AI
            dashboard.
          </p>
        </div>
        <div class="testimonials-grid">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.author"
            class="testimonial-card"
          >
            <div class="testimonial-content">
              <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
              <div class="testimonial-author">
                <v-avatar size="48" class="author-avatar">
                  <img :src="testimonial.avatar" :alt="testimonial.author" height="50" />
                </v-avatar>
                <div class="author-info">
                  <div class="author-name">{{ testimonial.author }}</div>
                  <div class="author-role">{{ testimonial.role }}</div>
                  <div class="author-company">{{ testimonial.company }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Transform Your Customer Service?</h2>
          <p class="cta-subtitle">
            Join thousands of companies already using Abyssaltech.AI to deliver exceptional customer
            experiences. Start your free trial today and see the difference AI-powered insights can
            make.
          </p>
          <div class="cta-actions">
            <NuxtLink to="/auth/register" class="cta-primary"> Start Free Trial </NuxtLink>
            <NuxtLink to="/auth/login" class="cta-secondary"> Schedule Demo </NuxtLink>
          </div>
          <p class="cta-note">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <img
              src="/images/logos/abyssaltech_logo_black.png"
              alt="Abyssaltech.AI"
              class="footer-logo"
            />
            <p class="footer-description">
              Empowering businesses with intelligent AI customer service solutions and comprehensive
              monitoring tools.
            </p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4 class="link-title">Product</h4>
              <NuxtLink to="#" class="footer-link">Features</NuxtLink>
              <NuxtLink to="#" class="footer-link">Pricing</NuxtLink>
              <NuxtLink to="#" class="footer-link">API</NuxtLink>
              <NuxtLink to="#" class="footer-link">Documentation</NuxtLink>
            </div>
            <div class="link-group">
              <h4 class="link-title">Company</h4>
              <NuxtLink to="#" class="footer-link">About</NuxtLink>
              <NuxtLink to="#" class="footer-link">Blog</NuxtLink>
              <NuxtLink to="#" class="footer-link">Careers</NuxtLink>
              <NuxtLink to="#" class="footer-link">Contact</NuxtLink>
            </div>
            <div class="link-group">
              <h4 class="link-title">Support</h4>
              <NuxtLink to="#" class="footer-link">Help Center</NuxtLink>
              <NuxtLink to="#" class="footer-link">Community</NuxtLink>
              <NuxtLink to="#" class="footer-link">Status</NuxtLink>
              <NuxtLink to="#" class="footer-link">Security</NuxtLink>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">© 2025 Abyssaltech.AI. All rights reserved.</p>
          <div class="footer-legal">
            <NuxtLink to="#" class="legal-link">Privacy Policy</NuxtLink>
            <NuxtLink to="#" class="legal-link">Terms of Service</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
