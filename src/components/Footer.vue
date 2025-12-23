<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="w-full text-gray-500 px-4">
    <div class="max-w-7xl mx-auto pt-8">
      <div class="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div class="md:max-w-96">
          <img src="/images/logo.svg" alt="Tres Mimarlık" class="h-10" />
          <p class="mt-6 text-sm">{{ $t('footer.description') }}</p>
        </div>
        <div class="flex-1 flex items-start md:justify-end gap-20">
          <div>
            <h2 class="font-semibold mb-5 text-gray-800">{{ $t('footer.quickLinks') }}</h2>
            <ul class="text-sm space-y-2">
              <li>
                <RouterLink to="/#hero" class="hover:text-[#E30613]">{{ $t('nav.home') }}</RouterLink>
              </li>
              <li>
                <RouterLink to="/#hakkimizda" class="hover:text-[#E30613]">{{ $t('nav.about') }}</RouterLink>
              </li>
              <li>
                <RouterLink to="/#projeler" class="hover:text-[#E30613]">{{ $t('nav.projects') }}</RouterLink>
              </li>
              <li>
                <RouterLink to="/#ekip" class="hover:text-[#E30613]">{{ $t('nav.team') }}</RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="font-semibold mb-5 text-gray-800">{{ $t('footer.contactTitle') }}</h2>
            <div class="text-sm space-y-2">
              <p>+90 (216) 123 45 67</p>
              <p>info@tresmimarlik.com</p>
            </div>
          </div>
        </div>
      </div>
      <p class="py-4 text-center text-xs md:text-sm">{{ $t('footer.copyright') }} | {{ $t('footer.madeBy') }}</p>
    </div>
  </footer>
</template>
