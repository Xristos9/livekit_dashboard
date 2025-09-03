<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})

useHead({
  title: 'Abyssaltech.AI - AI Customer Service Dashboard',
  meta: [
    { name: 'description', content: 'Monitor and optimize your AI customer service agents with real-time analytics, performance insights, and comprehensive reporting.' }
  ]
})

const features = ref([
  {
    icon: 'solar:chart-line-duotone',
    title: 'Real-time Analytics',
    description: 'Monitor your AI agents performance with live metrics, response times, and customer satisfaction scores.'
  },
  {
    icon: 'solar:users-group-two-rounded-line-duotone',
    title: 'Agent Management',
    description: 'Manage multiple AI agents, track their conversations, and optimize their responses for better customer experience.'
  },
  {
    icon: 'solar:dollar-minimalistic-line-duotone',
    title: 'Cost Optimization',
    description: 'Track API costs, token usage, and optimize your AI spending with detailed cost breakdowns and forecasting.'
  },
  {
    icon: 'solar:shield-check-line-duotone',
    title: 'Quality Assurance',
    description: 'Ensure consistent service quality with automated monitoring, conversation analysis, and performance alerts.'
  },
  {
    icon: 'solar:phone-calling-rounded-line-duotone',
    title: 'Call Recording',
    description: 'Record and analyze customer calls with AI-powered transcription and sentiment analysis for continuous improvement.'
  },
  {
    icon: 'solar:graph-new-up-line-duotone',
    title: 'Performance Insights',
    description: 'Get actionable insights from conversation data to improve agent responses and customer satisfaction rates.'
  }
])

const stats = ref([
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '2.3s', label: 'Avg Response Time' },
  { value: '1000+', label: 'Active Agents' },
  { value: '50M+', label: 'Conversations Handled' }
])

const testimonials = ref([
  {
    quote: 'Abyssaltech.AI transformed our customer service. Our response times improved by 80% and customer satisfaction scores increased dramatically.',
    author: 'Sarah Johnson',
    role: 'Customer Success Director',
    company: 'TechCorp Solutions',
    avatar: '/images/profile/user-1.jpg'
  },
  {
    quote: 'The analytics dashboard gives us incredible insights into our AI agents performance. We can now optimize conversations in real-time.',
    author: 'Michael Chen',
    role: 'Operations Manager',
    company: 'Global Services Inc',
    avatar: '/images/profile/user-2.jpg'
  },
  {
    quote: 'Cost tracking and optimization features helped us reduce our AI operational costs by 40% while improving service quality.',
    author: 'Emily Rodriguez',
    role: 'CTO',
    company: 'StartupXYZ',
    avatar: '/images/profile/user-3.jpg'
  }
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
              <span class="gradient-text">Revolutionize</span> Your Customer Service with AI Intelligence
            </h1>
            <p class="hero-subtitle">
              Monitor, analyze, and optimize your AI customer service agents with our comprehensive dashboard. 
              Get real-time insights, track performance metrics, and ensure exceptional customer experiences.
            </p>
            <div class="hero-stats">
              <div class="stat-avatars">
                <v-avatar v-for="i in 3" :key="i" size="40" class="avatar-border">
                  <img :src="`/images/profile/user-${i}.jpg`" :alt="`User ${i}`" />
                </v-avatar>
              </div>
              <div class="stat-text">
                <h6 class="stat-number">1,000+</h6>
                <p class="stat-label">teams manage AI agents with our platform</p>
              </div>
            </div>
            <div class="hero-actions">
              <NuxtLink to="/auth/register" class="primary-btn">
                Start Free Trial
              </NuxtLink>
              <NuxtLink to="/auth/login" class="secondary-btn">
                View Demo
              </NuxtLink>
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
                  <div class="metric-trend positive">+12%</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">Avg Response</div>
                  <div class="metric-value">2.3s</div>
                  <div class="metric-trend positive">-15%</div>
                </div>
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 45%"></div>
                    <div class="bar" style="height: 90%"></div>
                    <div class="bar" style="height: 70%"></div>
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
            Everything you need to monitor, manage, and optimize your AI customer service agents in one comprehensive platform.
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
            See how companies worldwide are transforming their customer service with our AI dashboard.
          </p>
        </div>
        <div class="testimonials-grid">
          <div v-for="testimonial in testimonials" :key="testimonial.author" class="testimonial-card">
            <div class="testimonial-content">
              <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
              <div class="testimonial-author">
                <v-avatar size="48" class="author-avatar">
                  <img :src="testimonial.avatar" :alt="testimonial.author" />
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
            Join thousands of companies already using Abyssaltech.AI to deliver exceptional customer experiences.
            Start your free trial today and see the difference AI-powered insights can make.
          </p>
          <div class="cta-actions">
            <NuxtLink to="/auth/register" class="cta-primary">
              Start Free Trial
            </NuxtLink>
            <NuxtLink to="/auth/login" class="cta-secondary">
              Schedule Demo
            </NuxtLink>
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
            <img src="/images/logos/abyssaltech_logo_black.png" alt="Abyssaltech.AI" class="footer-logo" />
            <p class="footer-description">
              Empowering businesses with intelligent AI customer service solutions and comprehensive monitoring tools.
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

<style scoped lang="scss">
.landing-page {
  background: linear-gradient(135deg, rgb(var(--v-theme-background)) 0%, rgb(var(--v-theme-surface)) 100%);
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.1);

  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;

    .logo img {
      height: 40px;
    }

    .navigation {
      display: none;
      gap: 32px;

      @media (min-width: 768px) {
        display: flex;
      }

      .nav-link {
        color: rgb(var(--v-theme-textSecondary));
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;

        &:hover {
          color: rgb(var(--v-theme-primary));
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;

      .login-btn {
        color: rgb(var(--v-theme-textPrimary));
        text-decoration: none;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(var(--v-theme-primary), 0.1);
          color: rgb(var(--v-theme-primary));
        }
      }

      .signup-btn {
        background: rgb(var(--v-theme-primary));
        color: white;
        text-decoration: none;
        font-weight: 600;
        padding: 12px 24px;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(var(--v-theme-primary), 0.9);
          transform: translateY(-1px);
        }
      }
    }
  }
}

.hero {
  padding: 120px 20px 80px;
  
  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 60px;
    align-items: center;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 24px;
    color: rgb(var(--v-theme-textPrimary));

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .hero-subtitle {
    font-size: 1.25rem;
    line-height: 1.6;
    color: rgb(var(--v-theme-textSecondary));
    margin-bottom: 32px;
  }

  .hero-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;

    .stat-avatars {
      display: flex;

      .avatar-border {
        border: 3px solid rgb(var(--v-theme-surface));
        margin-left: -8px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .stat-text {
      .stat-number {
        font-size: 1.125rem;
        font-weight: 600;
        color: rgb(var(--v-theme-textPrimary));
        margin: 0;
      }

      .stat-label {
        font-size: 0.875rem;
        color: rgb(var(--v-theme-textSecondary));
        margin: 0;
      }
    }
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    .primary-btn {
      background: rgb(var(--v-theme-primary));
      color: white;
      text-decoration: none;
      font-weight: 600;
      padding: 16px 32px;
      border-radius: 12px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.9);
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(var(--v-theme-primary), 0.4);
      }
    }

    .secondary-btn {
      background: transparent;
      color: rgb(var(--v-theme-textPrimary));
      text-decoration: none;
      font-weight: 600;
      padding: 16px 32px;
      border: 2px solid rgba(var(--v-theme-borderColor), 0.3);
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgb(var(--v-theme-primary));
        color: rgb(var(--v-theme-primary));
        transform: translateY(-2px);
      }
    }
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;

    .dashboard-preview {
      background: rgb(var(--v-theme-surface));
      border: 1px solid rgba(var(--v-theme-borderColor), 0.2);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;

      .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.1);

        .preview-dots {
          display: flex;
          gap: 6px;

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;

            &.red { background: #ff5f57; }
            &.yellow { background: #ffbd2e; }
            &.green { background: #28ca42; }
          }
        }

        .preview-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgb(var(--v-theme-textSecondary));
        }
      }

      .preview-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 20px;

        .metric-card {
          background: rgba(var(--v-theme-primary), 0.05);
          border: 1px solid rgba(var(--v-theme-primary), 0.1);
          border-radius: 8px;
          padding: 12px;

          .metric-label {
            font-size: 0.75rem;
            color: rgb(var(--v-theme-textSecondary));
            margin-bottom: 4px;
          }

          .metric-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: rgb(var(--v-theme-textPrimary));
            margin-bottom: 4px;
          }

          .metric-trend {
            font-size: 0.75rem;
            font-weight: 600;

            &.positive {
              color: rgb(var(--v-theme-success));
            }
          }
        }

        .chart-placeholder {
          grid-column: span 2;
          background: rgba(var(--v-theme-borderColor), 0.05);
          border-radius: 8px;
          padding: 16px;
          height: 80px;

          .chart-bars {
            display: flex;
            align-items: end;
            justify-content: space-between;
            height: 100%;
            gap: 4px;

            .bar {
              background: rgb(var(--v-theme-primary));
              border-radius: 2px;
              width: 100%;
              opacity: 0.7;
              transition: opacity 0.3s ease;

              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}

.stats-section {
  padding: 60px 20px;
  background: rgba(var(--v-theme-primary), 0.02);
  border-top: 1px solid rgba(var(--v-theme-borderColor), 0.1);
  border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.1);

  .stats-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    text-align: center;

    .stat-item {
      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: rgb(var(--v-theme-primary));
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 0.875rem;
        color: rgb(var(--v-theme-textSecondary));
        font-weight: 500;
      }
    }
  }
}

.features-section {
  padding: 100px 20px;

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: rgb(var(--v-theme-textPrimary));
      margin-bottom: 16px;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: rgb(var(--v-theme-textSecondary));
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;

    .feature-card {
      background: rgb(var(--v-theme-surface));
      border: 1px solid rgba(var(--v-theme-borderColor), 0.1);
      border-radius: 16px;
      padding: 32px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        border-color: rgba(var(--v-theme-primary), 0.2);
      }

      .feature-icon {
        width: 64px;
        height: 64px;
        background: rgba(var(--v-theme-primary), 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        color: rgb(var(--v-theme-primary));
      }

      .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: rgb(var(--v-theme-textPrimary));
        margin-bottom: 12px;
      }

      .feature-description {
        color: rgb(var(--v-theme-textSecondary));
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}

.testimonials-section {
  padding: 100px 20px;
  background: rgba(var(--v-theme-primary), 0.02);

  .testimonials-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 60px;

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: rgb(var(--v-theme-textPrimary));
      margin-bottom: 16px;
    }

    .section-subtitle {
      font-size: 1.125rem;
      color: rgb(var(--v-theme-textSecondary));
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;

    .testimonial-card {
      background: rgb(var(--v-theme-surface));
      border: 1px solid rgba(var(--v-theme-borderColor), 0.1);
      border-radius: 16px;
      padding: 32px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .testimonial-quote {
        font-size: 1.125rem;
        line-height: 1.6;
        color: rgb(var(--v-theme-textPrimary));
        margin-bottom: 24px;
        font-style: italic;
      }

      .testimonial-author {
        display: flex;
        align-items: center;
        gap: 16px;

        .author-avatar {
          border: 2px solid rgba(var(--v-theme-primary), 0.2);
        }

        .author-info {
          .author-name {
            font-weight: 600;
            color: rgb(var(--v-theme-textPrimary));
            margin-bottom: 4px;
          }

          .author-role {
            font-size: 0.875rem;
            color: rgb(var(--v-theme-textSecondary));
            margin-bottom: 2px;
          }

          .author-company {
            font-size: 0.875rem;
            color: rgb(var(--v-theme-primary));
            font-weight: 500;
          }
        }
      }
    }
  }
}

.cta-section {
  padding: 100px 20px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.8));

  .cta-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .cta-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 20px;
  }

  .cta-subtitle {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 40px;
    line-height: 1.6;
  }

  .cta-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;

    .cta-primary {
      background: white;
      color: rgb(var(--v-theme-primary));
      text-decoration: none;
      font-weight: 600;
      padding: 16px 32px;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      }
    }

    .cta-secondary {
      background: transparent;
      color: white;
      text-decoration: none;
      font-weight: 600;
      padding: 16px 32px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
        transform: translateY(-2px);
      }
    }
  }

  .cta-note {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
}

.footer {
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-borderColor), 0.1);
  padding: 60px 20px 20px;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 40px;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 2fr;
    }

    .footer-brand {
      .footer-logo {
        height: 40px;
        margin-bottom: 16px;
      }

      .footer-description {
        color: rgb(var(--v-theme-textSecondary));
        line-height: 1.6;
        margin: 0;
      }
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 32px;

      .link-group {
        .link-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgb(var(--v-theme-textPrimary));
          margin-bottom: 16px;
        }

        .footer-link {
          display: block;
          color: rgb(var(--v-theme-textSecondary));
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.2s ease;

          &:hover {
            color: rgb(var(--v-theme-primary));
          }
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid rgba(var(--v-theme-borderColor), 0.1);
    flex-wrap: wrap;
    gap: 16px;

    .copyright {
      color: rgb(var(--v-theme-textSecondary));
      font-size: 0.875rem;
      margin: 0;
    }

    .footer-legal {
      display: flex;
      gap: 24px;

      .legal-link {
        color: rgb(var(--v-theme-textSecondary));
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s ease;

        &:hover {
          color: rgb(var(--v-theme-primary));
        }
      }
    }
  }
}
</style>