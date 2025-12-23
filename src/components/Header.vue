<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { House, Layers, FolderKanban, Users, Mail, DraftingCompass, ChevronDown } from 'lucide-vue-next'

const { t, locale } = useI18n()

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Dil seçimi
const languages = [
  { code: 'tr', name: 'Türkçe', flag: '/images/tr.svg' },
  { code: 'en', name: 'English', flag: '/images/gb.png' },
]
const currentLang = ref(languages[0])
const langDropdownOpen = ref(false)

const selectLanguage = (lang) => {
  currentLang.value = lang
  locale.value = lang.code // i18n global locale'i değiştir
  langDropdownOpen.value = false
  document.activeElement.blur()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="sticky top-0 z-50 transition-all duration-300 bg-white" :class="isScrolled ? 'bg-white shadow-lg' : 'bg-[#F4F4F4]'">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Tres-Mimarlık</span>
          <img class="h-8 w-auto" src="/public/images/logo.svg" alt="Tres-Mimarlık-Logo" />
        </RouterLink>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>
      <!-- Desktop Menu -->
      <div class="hidden lg:flex lg:gap-x-14">
        <RouterLink to="/" class="text-sm/6 font-semibold text-zinc-950 flex gap-2 group hover:text-[#E30613] transition-all duration-300">
          <House class="w-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 text-[#E30613]" />
          <span class="hover">{{ $t('nav.home') }}</span>
        </RouterLink>
        <RouterLink to="/#hakkimizda" class="text-sm/6 font-semibold text-zinc-950 flex gap-2 group hover:text-[#E30613] transition-all duration-300">
          <Layers class="w-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 text-[#E30613]" />
          <span>{{ $t('nav.about') }}</span>
        </RouterLink>
        <RouterLink to="/projeler" class="text-sm/6 font-semibold text-zinc-950 flex gap-2 group hover:text-[#E30613] transition-all duration-300">
          <DraftingCompass class="w-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 text-[#E30613]" />
          <span>{{ $t('nav.projects') }}</span>
        </RouterLink>
        <RouterLink to="/#ekip" class="text-sm/6 font-semibold text-zinc-950 flex gap-2 group hover:text-[#E30613] transition-all duration-300">
          <Users class="w-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 text-[#E30613]" />
          <span>{{ $t('nav.team') }}</span>
        </RouterLink>
        <RouterLink to="/#iletisim" class="text-sm/6 font-semibold text-zinc-950 flex gap-2 group hover:text-[#E30613] transition-all duration-300">
          <Mail class="w-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 text-[#E30613]" />
          <span>{{ $t('nav.contact') }}</span>
        </RouterLink>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-1">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost gap-2 text-zinc-950 min-w-[110px]" @focus="langDropdownOpen = true" @blur="langDropdownOpen = false">
            <img :src="currentLang.flag" class="w-5 h-5 rounded-sm" :alt="currentLang.name" />
            {{ currentLang.name }}
            <ChevronDown class="w-4 h-4 transition-transform duration-300" :class="langDropdownOpen ? 'rotate-180' : ''" />
          </div>
          <ul tabindex="0" class="dropdown-content menu z-100 w-40 rounded-box bg-white p-2 shadow-lg mt-2">
            <li v-for="lang in languages" :key="lang.code">
              <button @click="selectLanguage(lang)" class="flex gap-2 items-center">
                <img :src="lang.flag" class="w-5 h-5 rounded-sm" />
                {{ lang.name }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50 bg-black/50"></div>
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="-m-1.5 p-1.5" @click="mobileMenuOpen = false">
            <span class="sr-only">Tres Mimarlık</span>
            <img class="h-8 w-auto" src="/public/images/logowhite.svg" alt="Tres-Mimarlık-Logo" />
          </RouterLink>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-400" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-white/10">
            <div class="space-y-2 py-6">
              <RouterLink to="/" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5" @click="mobileMenuOpen = false">{{ $t('nav.home') }}</RouterLink>
              <RouterLink to="/#hakkimizda" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5" @click="mobileMenuOpen = false">
                {{ $t('nav.about') }}
              </RouterLink>
              <RouterLink to="/projeler" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5" @click="mobileMenuOpen = false">
                {{ $t('nav.projects') }}
              </RouterLink>
              <RouterLink to="/#ekip" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5" @click="mobileMenuOpen = false">{{ $t('nav.team') }}</RouterLink>
              <RouterLink to="/#iletisim" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5" @click="mobileMenuOpen = false">
                {{ $t('nav.contact') }}
              </RouterLink>
            </div>
            <!-- Dil Seçici (Mobil) -->
            <div class="py-6">
              <p class="text-xs text-gray-400 uppercase tracking-wider mb-3">{{ $t('nav.langSelect') }}</p>
              <div class="flex gap-3">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="selectLanguage(lang)"
                  :class="['flex items-center gap-2 px-4 py-2 rounded-lg transition-all', currentLang.code === lang.code ? 'bg-[#E30613] text-white' : 'bg-white/10 text-white hover:bg-white/20']">
                  <img :src="lang.flag" class="w-5 h-5 rounded-sm" :alt="lang.name" />
                  {{ lang.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
