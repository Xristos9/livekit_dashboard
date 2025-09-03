<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Abyssaltech.AI',
})
</script>

<template>
  <div class="bg-background">
    <header
      class="v-toolbar v-toolbar--flat v-toolbar--density-default v-theme--BLUE_THEME v-locale--is-ltr v-app-bar front-lp-header position-relative py-md-4"
      style="top: 0; z-index: 1006; transform: translateY(0); position: fixed; left: 0; width: 100%"
    >
      <div class="v-toolbar__content" style="height: 80px">
        <div class="v-container v-locale--is-ltr max-width-1218 py-0">
          <header
            class="v-toolbar v-toolbar--density-default v-theme--BLUE_THEME v-locale--is-ltr d-flex align-center"
          >
            <div class="v-toolbar__content" style="height: 64px">
              <div class="logo">
                <NuxtLink to="/"
                  ><img src="/images/logos/abyssaltech_logo_black.png" alt="home"
                /></NuxtLink>
              </div>
              <div class="navigation d-lg-flex d-none mx-auto">
                <div
                  class="d-flex flex-lg-row flex-column align-lg-center justify-space-between ga-lg-6 ga-4 pa-lg-0 pa-6 w-100"
                >
                  <NuxtLink
                    class="v-btn v-btn--flat v-theme--BLUE_THEME v-btn--density-default v-btn--size-default v-btn--variant-text custom-hover-primary bg-darkgray d-md-none d-flex h-43 w-full transform-none px-5 text-white"
                    to="/auth/login"
                    style="text-transform: capitalize; letter-spacing: 0"
                  >
                    <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
                    <span class="v-btn__content" data-no-activator
                      ><span class="text-white">Log in</span></span
                    >
                  </NuxtLink>
                </div>
              </div>
              <div class="d-flex ms-xl-0 ms-auto">
                <NuxtLink
                  class="v-btn v-btn--flat v-theme--BLUE_THEME v-btn--density-default v-btn--size-large v-btn--variant-text custom-hover-primary bg-darkgray me-lg-0 d-md-flex d-none me-3 transform-none px-6 text-white"
                  to="/auth/login"
                  style="text-transform: capitalize; letter-spacing: 0"
                >
                  <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
                  <span class="v-btn__content" data-no-activator
                    ><span class="text-white">Log in</span></span
                  >
                </NuxtLink>
                <button
                  type="button"
                  class="v-btn v-btn--icon v-theme--BLUE_THEME v-btn--density-default v-btn--size-default v-btn--variant-text hidden-lg-and-up"
                  style="text-transform: capitalize; letter-spacing: 0"
                >
                  <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
                  <span class="v-btn__content" data-no-activator>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon-tabler icon-tabler-menu-2"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 6h16" />
                      <path d="M4 12h16" />
                      <path d="M4 18h16" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>
    </header>
  </div>
  <div class="bg-background overflow-hidden">
    <div class="v-container v-locale--is-ltr max-width-1218 pt-md-10 pb-xl-0 pt-6 pb-10">
      <div class="v-row d-flex align-center justify-center">
        <div class="v-col-lg-6 v-col-12 text-align-start">
          <h1 class="text-56 textPrimary"><b>Manage your AI Agent</b> with a single dashboard.</h1>
          <div
            class="d-sm-flex align-center justify-md-start justify-center gap-3 pt-5 text-center"
          >
            <div class="d-flex justify-sm-start ml-2 flex-row-reverse justify-center">
              <div
                class="v-avatar v-theme--BLUE_THEME v-avatar--density-default v-avatar--variant-flat ml-n2 avtar-border"
                style="width: 40px; height: 40px"
              >
                <img src="public/images/profile/user-3.jpg" height="40" alt="usericon" /><span
                  class="v-avatar__underlay"
                ></span>
              </div>
              <div
                class="v-avatar v-theme--BLUE_THEME v-avatar--density-default v-avatar--variant-flat ml-n2 avtar-border"
                style="width: 40px; height: 40px"
              >
                <img src="public/images/profile/user-2.jpg" height="40" alt="usericon" /><span
                  class="v-avatar__underlay"
                ></span>
              </div>
              <div
                class="v-avatar v-theme--BLUE_THEME v-avatar--density-default v-avatar--variant-flat ml-n2 avtar-border"
                style="width: 40px; height: 40px"
              >
                <img src="public/images/profile/user-1.jpg" height="40" alt="usericon" /><span
                  class="v-avatar__underlay"
                ></span>
              </div>
            </div>
            <div class="d-sm-flex text-muted">
              <h6 class="text-17 font-weight-medium mt-sm-0 mt-2 ml-2">1,000+</h6>
              <h6 class="text-17 font-weight-medium ml-2">teams manage rooms with our tools</h6>
            </div>
          </div>
          <div
            class="d-flex ga-sm-6 ga-3 justify-md-start align-center technology flex-wrap justify-center pt-9 pb-7"
          ></div>
          <div class="d-flex justify-md-start justify-center">
            <NuxtLink
              class="v-btn v-btn--flat v-theme--BLUE_THEME bg-primary v-btn--density-default v-btn--size-large v-btn--variant-elevated m-btn-full transform-none px-8"
              to="/auth/login"
              style="text-transform: capitalize; letter-spacing: 0"
            >
              <span class="v-btn__overlay"></span><span class="v-btn__underlay"></span>
              <span class="v-btn__content" data-no-activator>Get Started</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
