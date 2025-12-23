<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Award, DraftingCompass, ArrowRight, X, ChevronLeft, ChevronRight, MapPinHouse, Phone, Mail } from 'lucide-vue-next'
import projectsData from '@/data/projects.json'
import teamData from '@/data/team.json'

const { t } = useI18n()

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

const projects = projectsData.projects
const featuredProjects = projects.filter((p) => p.featured)
const team = teamData.team

// Swiper modules
const modules = [FreeMode, Mousewheel]

// Modal state
const selectedProject = ref(null)
const currentImageIndex = ref(0)

// Modal aç
const openModal = (project) => {
  selectedProject.value = project
  currentImageIndex.value = 0
  document.body.style.overflow = 'hidden'
}

// Modal kapat
const closeModal = () => {
  selectedProject.value = null
  document.body.style.overflow = ''
}

// Galeri navigasyonu
const nextImage = () => {
  if (selectedProject.value?.gallery?.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % selectedProject.value.gallery.length
  }
}

const prevImage = () => {
  if (selectedProject.value?.gallery?.length > 0) {
    currentImageIndex.value = currentImageIndex.value === 0 ? selectedProject.value.gallery.length - 1 : currentImageIndex.value - 1
  }
}

// Mevcut görseli al
const currentGalleryImage = computed(() => {
  if (selectedProject.value?.gallery?.length > 0) {
    return selectedProject.value.gallery[currentImageIndex.value]
  }
  return selectedProject.value?.image
})

// Counter değerleri
const counter1 = ref(0) // 27+
const counter2 = ref(0) // 90+
const counter3 = ref(0) // 200K+

const statsRef = ref(null)
let hasAnimated = false

// Form veriler
const formData = reactive({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  message: '',
})

// Hata mesajları
const errors = reactive({
  firstName: '',
  lastName: '',
  contact: '',
  message: '',
})

// Form gönderildi mi
const formSubmitted = ref(false)
const isLoading = ref(false)

// Email format kontrolü
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Telefon format kontrolü (en az 10 rakam)
const isValidPhone = (phone) => {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10
}

// Form validasyonu
const validateForm = () => {
  let isValid = true

  // Reset errors
  errors.firstName = ''
  errors.lastName = ''
  errors.contact = ''
  errors.message = ''

  // Ad kontrolü
  if (!formData.firstName.trim()) {
    errors.firstName = 'Adınız zorunludur'
    isValid = false
  }

  // Soyad kontrolü
  if (!formData.lastName.trim()) {
    errors.lastName = 'Soyadınız zorunludur'
    isValid = false
  }

  // Email veya Telefon kontrolü
  const hasEmail = formData.email.trim() !== ''
  const hasPhone = formData.phone.trim() !== ''

  if (!hasEmail && !hasPhone) {
    errors.contact = 'Email veya telefon numarasından en az birini girmelisiniz'
    isValid = false
  } else {
    if (hasEmail && !isValidEmail(formData.email)) {
      errors.contact = 'Geçerli bir email adresi giriniz'
      isValid = false
    }
    if (hasPhone && !isValidPhone(formData.phone)) {
      errors.contact = 'Geçerli bir telefon numarası giriniz'
      isValid = false
    }
  }

  // Mesaj kontrolü
  if (!formData.message.trim()) {
    errors.message = 'Mesaj girmeyi unuttunuz :)'
    isValid = false
  }

  return isValid
}

// Form gönderimi
const submitForm = async () => {
  if (validateForm()) {
    // Loading başlat
    isLoading.value = true

    // Simüle gönderim (backend entegrasyonu için bekle)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Form başarılı
    isLoading.value = false
    formSubmitted.value = true
    console.log('Form gönderildi:', formData)

    // 3 saniye sonra formu sıfırla
    setTimeout(() => {
      formData.firstName = ''
      formData.lastName = ''
      formData.company = ''
      formData.email = ''
      formData.phone = ''
      formData.message = ''
      formSubmitted.value = false
    }, 3000)
  }
}

// Ease-out fonksiyonu
const easeOutQuad = (t) => t * (2 - t)

// Sayı animasyonu
const animateCounter = (target, counterRef, duration = 2000, suffix = '') => {
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease-out efekti uygula
    const easedProgress = easeOutQuad(progress)
    counterRef.value = Math.floor(easedProgress * target)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      counterRef.value = target
    }
  }

  requestAnimationFrame(animate)
}

// Intersection Observer ile görünürlük kontrolü
const startCounters = () => {
  if (hasAnimated) return
  hasAnimated = true

  animateCounter(27, counter1, 1500)
  animateCounter(90, counter2, 2000)
  animateCounter(200, counter3, 2500)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters()
        }
      })
    },
    { threshold: 0.3 },
  )

  if (statsRef.value) {
    observer.observe(statsRef.value)
  }

  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section
      id="hero"
      class="relative min-h-[90vh] lg:min-h-[90vh] md:min-h-[90vh] sm:min-h-[40vh] flex items-center py-10 sm:py-16 lg:py-24 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/images/aryom-koru-2.jpg')">
      <!-- Koyu overlay -->
      <div class="absolute inset-0 bg-black/40"></div>

      <div class="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex flex-col items-center text-center">
          <div class="flex flex-col items-center">
            <p class="lg:inline sm:inline text-base font-bold tracking-widest bg-linear-to-r text-[#E30613] uppercase">{{ $t('hero.tagline') }}</p>
            <h1 class="mt-4 text-2xl font-bold text-white lg:mt-3 sm:text-6xl xl:text-6xl">
              {{ $t('hero.title1') }}
              <br />
              {{ $t('hero.title2') }}
            </h1>
            <p class="mt-4 text-base text-white lg:mt-8 sm:text-xl max-w-xl">{{ $t('hero.subtitle') }}</p>
            <!-- Award Badge - Yatay Pill Tasarım -->
            <div class="mt-8 inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full">
              <Award class="w-5 h-5 sm:w-6 sm:h-6 text-red-500 shrink-0" />
              <span class="text-white font-semibold text-xs sm:text-sm">{{ $t('hero.award') }}</span>
              <span class="bg-clip-text text-red-500">|</span>
              <span class="text-white/90 text-xs sm:text-sm">{{ $t('hero.awardDesc') }}</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-1 sm:gap-7 mt-2">
              <RouterLink to="/projeler" class="btn w-60 mt-6 bg-white/60 border-2 border-black">
                <DraftingCompass class="w-5" />
                {{ $t('hero.cta1') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hakkımızda Section -->
    <section id="hakkimizda" class="min-h-230 bg-white text-zinc-950 scroll-mt-40">
      <div class="gap-16 py-8 px-4 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6 items-start">
        <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400 mt-15 ml-5 mr-10 lg:ml-0 lg:mr-0 md:ml-10 md:mr-10">
          <h2 class="mb-5 lg:mb-10 text-4xl tracking-tight font-extrabold bg-clip-text text-transparent bg-linear-to-r from-[#E30613] to-[#E30613]/30">{{ $t('about.title') }}</h2>
          <p class="mb-4 text-black/80">{{ $t('about.description') }}</p>
          <dl ref="statsRef" class="grid max-w-3xl gap-8 mx-auto sm:grid-cols-3 mt-15">
            <div class="flex flex-col">
              <dt class="mb-2 text-3xl md:text-4xl font-extrabold text-gray-900">{{ counter1 }}+</dt>
              <dt class="inline-flex font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#E30613] to-[#E30613]/30 mb-2">{{ $t('about.stat1Label') }}</dt>
            </div>
            <div class="flex flex-col">
              <dt class="mb-2 text-3xl md:text-4xl font-extrabold text-gray-900">{{ counter2 }}+</dt>
              <dt class="inline-flex font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#E30613] to-[#E30613]/30 mb-2">{{ $t('about.stat2Label') }}</dt>
            </div>
            <div class="flex flex-col">
              <dt class="mb-2 text-3xl md:text-4xl font-extrabold text-gray-900">
                {{ counter3 }}K+
                <small class="text-base">m²</small>
              </dt>
              <dt class="inline-flex font-semibold bg-clip-text text-transparent bg-linear-to-r from-[#E30613] to-[#E30613]/30 mb-2">{{ $t('about.stat3Label') }}</dt>
            </div>
          </dl>
        </div>
        <div class="flex gap-15 pt-20 flex-col lg:flex-row md:flex-row sm:flex-col md:gap-5 lg:gap-5 md:ml-12 lg:ml-5">
          <img src="/public/images/bgimage.jpg" alt="" class="w-80 h-120 object-cover rounded-lg border border-gray-900/50" />
          <img src="/public/images/aryom-hero-2.png" alt="" class="w-80 h-120 object-cover rounded-lg mt-10 lg:mt-8 md:mt-15" />
        </div>
      </div>
    </section>
    <!-- Projeler Section -->
    <section id="projeler" class="gap-16 py-15 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6 md:py-25 items-start h-screen">
      <div class="flex">
        <div class="proje-text flex justify-between w-full">
          <div class="text-base px-4">
            <p class="mt-15 text-lg sm:text-xl text-gray-900 font-medium max-w-2xl mx-auto">{{ $t('projects.featured') }}</p>
            <h2 class="mb-5 lg:mb-10 text-3xl tracking-tight font-extrabold bg-clip-text text-transparent bg-linear-to-r from-[#E30613] to-[#E30613]/30">{{ $t('projects.title') }}</h2>
          </div>
          <div class="mt-13 align-end">
            {{ $t('projects.subtitle1') }}
            <br />
            {{ $t('projects.subtitle2') }}
            <div class="mt-2 flex justify-end group">
              <RouterLink to="/projeler">
                <ArrowRight class="w-10 h-10 rotate-320 group-hover:scale-140 transition-all duration-300 group-hover:text-red-600" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
      <!-- Swiper Slider -->
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="20"
        :free-mode="false"
        :grab-cursor="true"
        :loop="true"
        :mousewheel="{ forceToAxis: true }"
        :breakpoints="{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }"
        class="w-full mt-15 pb-4">
        <SwiperSlide v-for="project in featuredProjects" :key="project.id">
          <div class="select-none cursor-pointer" @click="openModal(project)">
            <div class="h-80 rounded-lg bg-white overflow-hidden group">
              <img :src="project.image" alt="" class="rounded-lg object-cover w-full h-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h2 class="mt-4 text-xl font-bold">{{ project.title }}</h2>

            <div class="flex gap-2">
              <span v-for="tag in project.tags" :key="tag" class="inline-flex items-center rounded-md mt-3 bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400 inset-ring inset-ring-red-400/20">
                {{ $t(`projects.tags.${tag}`) }}
              </span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- Proje Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedProject" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
            <!-- Kapat Butonu -->
            <button @click="closeModal" class="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <X class="w-5 h-5 text-gray-600" />
            </button>

            <!-- Sol - Proje Bilgileri -->
            <div class="lg:w-2/5 p-8 flex flex-col justify-center">
              <h2 class="text-2xl font-black text-gray-900 mb-6">{{ selectedProject.title }}</h2>

              <div class="space-y-4">
                <div>
                  <p class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('projects.sector') }}</p>
                  <div class="flex gap-2 mt-1">
                    <span v-for="tag in selectedProject.tags" :key="tag" class="text-sm bg-[#E30613]/10 text-[#E30613] px-3 py-1 rounded-full">
                      {{ $t(`projects.tags.${tag}`) }}
                    </span>
                  </div>
                </div>

                <div v-if="selectedProject.client">
                  <p class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('projects.client') }}</p>
                  <p class="text-gray-900 font-medium">{{ selectedProject.client }}</p>
                </div>

                <div v-if="selectedProject.year">
                  <p class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('projects.year') }}</p>
                  <p class="text-gray-900 font-medium">{{ selectedProject.year }}</p>
                </div>

                <div v-if="selectedProject.location">
                  <p class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('projects.location') }}</p>
                  <p class="text-gray-900 font-medium">{{ selectedProject.location }}</p>
                </div>

                <div v-if="selectedProject.area">
                  <p class="text-xs text-gray-400 uppercase tracking-wider">{{ $t('projects.area') }}</p>
                  <p class="text-gray-900 font-medium">{{ selectedProject.area }}</p>
                </div>
              </div>
            </div>

            <!-- Sağ - Galeri -->
            <div class="lg:w-3/5 bg-gray-100 relative min-h-[300px] lg:min-h-[500px]">
              <img :src="currentGalleryImage" :alt="selectedProject.title" class="w-full h-full object-cover" />

              <!-- Galeri Navigasyonu -->
              <div v-if="selectedProject.gallery?.length > 1" class="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button @click="prevImage" class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors">
                  <ChevronLeft class="w-5 h-5 text-gray-700" />
                </button>
                <span class="bg-white/90 px-3 py-1 rounded-full text-sm text-gray-700">{{ currentImageIndex + 1 }} / {{ selectedProject.gallery.length }}</span>
                <button @click="nextImage" class="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors">
                  <ChevronRight class="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <div class="px-4 mt-20 lg:mt-0 md:mt-0 relative md:mb-0">
      <div
        class="flex relative max-w-7xl mx-auto h-auto py-12 lg:py-16 mb-40 rounded-2xl items-center bg-[#E30613] px-8 lg:px-16 justify-between flex-col md:flex-row lg:flex-row gap-8 overflow-hidden">
        <img src="/public/images/ctavector.svg" alt="" class="absolute top-0 right-0 scale-100 opacity-80" />
        <div class="flex items-start justify-center text-white flex-col z-10 max-w-xl">
          <span class="text-white/70 text-sm font-medium tracking-wider uppercase mb-2">{{ $t('cta.tagline') }}</span>
          <h3 class="text-3xl lg:text-4xl font-bold mb-3">{{ $t('cta.title') }}</h3>
          <p class="text-white/90 text-base lg:text-lg">{{ $t('cta.subtitle') }}</p>
        </div>
        <div class="flex items-center z-10">
          <RouterLink
            to="#iletisim"
            class="group inline-flex items-center gap-3 bg-white text-[#E30613] font-semibold rounded-xl px-8 py-4 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
            {{ $t('cta.button') }}
            <ArrowRight class="w-5 h-5 rotate-45 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>
      </div>
    </div>
    <!-- Ekip Section -->
    <section id="ekip" class="min-h-screen bg-white text-zinc-950 scroll-mt-20 mt-20 lg:mt-0 md:mt-10">
      <div class="py-8 px-4 mx-auto max-w-7xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 class="text-4xl tracking-tight font-extrabold bg-clip-text text-transparent bg-linear-to-r from-[#E30613] to-[#E30613]/30 mb-2">{{ $t('team.title') }}</h2>
          <p class="font-light text-gray-500 lg:mb-16 sm:text-xl">{{ $t('team.subtitle') }}</p>
        </div>
        <div class="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2 items-stretch">
          <div v-for="member in team" :key="member.id" class="bg-gray-50 rounded-lg shadow sm:flex h-full">
            <img class="w-full sm:w-40 sm:h-full object-cover rounded-t-lg sm:rounded-none sm:rounded-l-lg shrink-0" :src="member.image" :alt="member.name" />
            <div class="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 class="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-black to-gray-400 mb-1">{{ member.name }}</h3>
                <span class="text-gray-500 text-sm">{{ member.role }}</span>
                <p class="mt-2 font-light text-gray-500 text-sm line-clamp-3">{{ member.bio }}</p>
              </div>
              <ul class="flex space-x-4 mt-3">
                <li v-if="member.socials.linkedin">
                  <a :href="member.socials.linkedin" class="text-gray-500 hover:text-red-600/60">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- İletişim Section -->
    <!-- <section id="iletisim" class="min-h-screen bg-gray-900 text-white scroll-mt-20">
      <div class="flex items-center justify-center h-screen">
        <div class="text-center px-4">
          <h2 class="text-4xl sm:text-6xl font-light tracking-wider">İletişim</h2>
          <p class="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">Bizimle iletişime geçin 📞</p>
        </div>
      </div>
    </section> -->
    <section id="iletisim" class="min-h-230 bg-white text-zinc-950 scroll-mt-40">
      <div class="gap-16 py-8 px-4 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6 items-start">
        <div class="font-light text-gray-500 sm:text-lg dark:text-gray-400 mt-15 ml-5 mr-10 lg:ml-0 lg:mr-0 md:ml-10 md:mr-10">
          <h2 class="mb-5 lg:mb-10 text-4xl tracking-tight font-extrabold bg-clip-text text-transparent bg-linear-to-r from-red-500 to-red-300">{{ $t('contact.heroTitle') }}</h2>
          <p class="mb-4">
            {{ $t('contact.heroSubtitle1') }}
            <br />
            {{ $t('contact.heroSubtitle2') }}
          </p>
          <div class="flex flex-row gap-5 sm:gap-15 mt-5 lg:mt-15 md:mt-10">
            <div class="hidden sm:flex w-15 h-15 bg-[#E30613] rounded-lg items-center justify-center text-white shrink-0"><MapPinHouse /></div>
            <div class="flex flex-col">
              <h3 class="text-[#E30613] font-black">{{ $t('contact.office') }}</h3>
              <p class="text-black/80">Teşvikiye, Poyracık Sk. No:25 D:1 Kat:1, 34365 Şişli/İstanbul</p>
            </div>
          </div>
          <div class="flex flex-row gap-5 sm:gap-15 mt-5 lg:mt-15 md:mt-10">
            <div class="hidden sm:flex w-15 h-15 bg-[#E30613] rounded-lg items-center justify-center text-white shrink-0"><Mail /></div>
            <div class="flex flex-col">
              <h3 class="text-[#E30613] font-black">{{ $t('contact.emailLabel') }}</h3>
              <p class="text-black/80">info@tresmimarlik.com</p>
            </div>
          </div>
          <div class="flex flex-row gap-5 sm:gap-15 mt-5 lg:mt-15 md:mt-10">
            <div class="hidden sm:flex w-15 h-15 bg-[#E30613] rounded-lg items-center justify-center text-white shrink-0"><Phone /></div>
            <div class="flex flex-col">
              <h3 class="text-[#E30613] font-black">{{ $t('contact.phoneLabel') }}</h3>
              <p class="text-black/80">(0212) 343 03 87</p>
            </div>
          </div>
        </div>
        <div class="flex gap-10 pt-0 flex-col lg:flex-row md:flex-row sm:flex-col md:gap-5 lg:gap-5 md:ml-12 lg:ml-5">
          <div class="isolate bg-white px-6 py-24 sm:py-0 lg:px-8">
            <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
              <div
                class="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
                style="
                  clip-path: polygon(
                    74.1% 44.1%,
                    100% 61.6%,
                    97.5% 26.9%,
                    85.5% 0.1%,
                    80.7% 2%,
                    72.5% 32.5%,
                    60.2% 62.4%,
                    52.4% 68.1%,
                    47.5% 58.3%,
                    45.2% 34.5%,
                    27.5% 76.7%,
                    0.1% 64.9%,
                    17.9% 100%,
                    27.6% 76.8%,
                    76.1% 97.7%,
                    74.1% 44.1%
                  );
                "></div>
            </div>
            <!-- Form -->
            <form @submit.prevent="submitForm" class="mx-auto mt-16 max-w-xl sm:mt-20">
              <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <!-- Ad -->
                <div>
                  <label for="first-name" class="block text-sm/6 font-semibold text-gray-900">
                    {{ $t('contact.firstName') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-2.5">
                    <input
                      v-model="formData.firstName"
                      type="text"
                      name="first-name"
                      id="first-name"
                      autocomplete="given-name"
                      :placeholder="$t('contact.placeholders.firstName')"
                      :class="[
                        'block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-300 placeholder:text-xs placeholder:italic focus:outline-2 focus:-outline-offset-2',
                        errors.firstName ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-300 focus:outline-[#E30613]',
                      ]" />
                  </div>
                  <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
                </div>

                <!-- Soyad -->
                <div>
                  <label for="last-name" class="block text-sm/6 font-semibold text-gray-900">
                    {{ $t('contact.lastName') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-2.5">
                    <input
                      v-model="formData.lastName"
                      type="text"
                      name="last-name"
                      id="last-name"
                      autocomplete="family-name"
                      :placeholder="$t('contact.placeholders.lastName')"
                      :class="[
                        'block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-300 placeholder:text-xs placeholder:italic focus:outline-2 focus:-outline-offset-2',
                        errors.lastName ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-300 focus:outline-[#E30613]',
                      ]" />
                  </div>
                  <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
                </div>

                <!-- Şirket -->
                <div class="sm:col-span-2">
                  <label for="company" class="block text-sm/6 font-semibold text-gray-900">
                    {{ $t('contact.company') }}
                    <small class="text-xs text-gray-500">{{ $t('contact.companyOptional') }}</small>
                  </label>
                  <div class="mt-2.5">
                    <input
                      v-model="formData.company"
                      type="text"
                      name="company"
                      id="company"
                      autocomplete="organization"
                      :placeholder="$t('contact.placeholders.company')"
                      class="block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-300 placeholder:text-xs placeholder:italic focus:outline-2 focus:-outline-offset-2 focus:outline-[#E30613]" />
                  </div>
                </div>

                <!-- Email -->
                <div class="sm:col-span-2">
                  <label for="email" class="block text-sm/6 font-semibold text-gray-900">
                    {{ $t('contact.email') }}
                    <small class="text-xs text-gray-500">{{ $t('contact.emailOrPhone') }}</small>
                  </label>
                  <div class="mt-2.5">
                    <input
                      v-model="formData.email"
                      type="email"
                      name="email"
                      id="email"
                      autocomplete="email"
                      :placeholder="$t('contact.placeholders.email')"
                      :class="[
                        'block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-300 placeholder:text-xs placeholder:italic focus:outline-2 focus:-outline-offset-2',
                        errors.contact && !formData.phone ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-300 focus:outline-[#E30613]',
                      ]" />
                  </div>
                </div>

                <!-- Telefon -->
                <div class="sm:col-span-2">
                  <label for="phone-number" class="block text-sm/6 font-semibold text-gray-900">
                    {{ $t('contact.phone') }}
                    <small class="text-xs text-gray-500">{{ $t('contact.emailOrPhone') }}</small>
                  </label>
                  <div class="mt-2.5">
                    <input
                      v-model="formData.phone"
                      type="tel"
                      name="phone-number"
                      id="phone-number"
                      autocomplete="tel"
                      :placeholder="$t('contact.placeholders.phone')"
                      :class="[
                        'block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-300 placeholder:text-xs placeholder:italic focus:outline-2 focus:-outline-offset-2',
                        errors.contact && !formData.email ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-300 focus:outline-[#E30613]',
                      ]" />
                  </div>
                  <p v-if="errors.contact" class="mt-1 text-sm text-red-500">{{ errors.contact }}</p>
                </div>

                <!-- Mesaj -->
                <div class="sm:col-span-2">
                  <label for="message" class="block text-sm/6 font-semibold text-gray-900">
                    {{ $t('contact.message') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-2.5">
                    <textarea
                      v-model="formData.message"
                      name="message"
                      id="message"
                      rows="4"
                      :placeholder="$t('contact.placeholders.message')"
                      :class="[
                        'block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-300 placeholder:text-xs placeholder:italic focus:outline-2 focus:-outline-offset-2',
                        errors.message ? 'outline-red-500 focus:outline-red-500' : 'outline-gray-300 focus:outline-[#E30613]',
                      ]"></textarea>
                  </div>
                  <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
                </div>
              </div>

              <div class="mt-10">
                <button
                  type="submit"
                  :disabled="isLoading || formSubmitted"
                  :class="[
                    'block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2',
                    formSubmitted ? 'bg-green-600' : isLoading ? 'bg-[#E30613]/70 cursor-wait' : 'bg-[#E30613] hover:bg-[#c00510] focus-visible:outline-[#E30613]',
                  ]">
                  <!-- Loading -->
                  <span v-if="isLoading" class="inline-flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ $t('contact.sending') }}
                  </span>
                  <!-- Başarılı -->
                  <span v-else-if="formSubmitted" class="inline-flex items-center gap-2">
                    <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ $t('contact.sent') }}
                  </span>
                  <!-- Normal -->
                  <span v-else>{{ $t('contact.submit') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<style scoped></style>
