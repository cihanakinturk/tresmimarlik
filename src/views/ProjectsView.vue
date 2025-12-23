<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import projectsData from '@/data/projects.json'

const { t, locale } = useI18n()
const projects = projectsData.projects

// Tüm benzersiz tag'leri çıkar (orijinal değerler)
const allOriginalTags = computed(() => {
  const tags = new Set()
  projects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag))
  })
  return ['ALL', ...Array.from(tags)]
})

// Seçili filtre (orijinal tag değeri veya 'ALL')
const activeFilter = ref('ALL')

// Dil değişince filtreyi sıfırla
watch(locale, () => {
  activeFilter.value = 'ALL'
})

// Filtrelenmiş projeler
const filteredProjects = computed(() => {
  if (activeFilter.value === 'ALL') {
    return projects
  }
  return projects.filter((project) => project.tags.includes(activeFilter.value))
})

// Tag'in çevrilmiş halini getir
const getTagLabel = (tag) => {
  if (tag === 'ALL') {
    return t('projects.filterAll')
  }
  return t(`projects.tags.${tag}`)
}

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
  if (selectedProject.value && selectedProject.value.gallery) {
    currentImageIndex.value = (currentImageIndex.value + 1) % selectedProject.value.gallery.length
  }
}

const prevImage = () => {
  if (selectedProject.value && selectedProject.value.gallery) {
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
</script>

<template>
  <div class="min-h-screen bg-white text-black/90">
    <section>
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-black pt-20 pb-0">
          {{ $t('projects.pageTitle1') }}
          <br />
          {{ $t('projects.pageTitle2') }}
        </h2>
        <p class="text-sm pt-2 pb-6 text-gray-500">{{ $t('projects.pageSubtitle') }}</p>

        <!-- Tag Filter -->
        <div class="flex flex-wrap gap-3 py-6 mb-6 border-b border-gray-100">
          <button
            v-for="tag in allOriginalTags"
            :key="tag"
            @click="activeFilter = tag"
            :class="[
              'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
              activeFilter === tag ? 'bg-[#E30613] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]">
            {{ getTagLabel(tag) }}
          </button>
        </div>

        <!-- Projeler Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          <div v-for="project in filteredProjects" :key="project.id" @click="openModal(project)" class="group relative overflow-hidden rounded-lg cursor-pointer">
            <!-- Proje Görseli -->
            <div class="h-64 bg-gray-200 overflow-hidden">
              <img :src="project.image" :alt="project.title" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <!-- Proje Bilgileri -->
            <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4">
              <h3 class="text-white font-bold text-lg">{{ project.title }}</h3>
              <div class="flex gap-2 mt-2">
                <span v-for="tag in project.tags" :key="tag" class="text-xs bg-white/30 text-white px-2 py-1 rounded">
                  {{ $t(`projects.tags.${tag}`) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
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
              <img :src="currentGalleryImage" :alt="selectedProject.title" loading="lazy" class="w-full h-full object-cover" />

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
  </div>
</template>

<style scoped>
/* Modal animasyonları */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
