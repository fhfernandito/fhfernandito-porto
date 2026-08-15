// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// CSS icon font
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
// import '../node_modules/vue3-marquee-slider/dist/style.css'

// Vuetify iconset
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'

import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { VFileUploadItem } from 'vuetify/labs/VFileUpload'
import { VOtpInput } from 'vuetify/components'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VIconBtn } from 'vuetify/labs/VIconBtn'
import { VVideo } from 'vuetify/labs/VVideo'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#fff06c',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#fff06c',
        },
      },
    },
  },
  
  icons: {
    defaultSet: 'mdi',
    aliases: mdiAliases,
    sets: {
      mdi,
      fa,
    },
  },

  components: {
    VFileUpload,
    VFileUploadItem,
    VOtpInput,
    VDateInput,
    VIconBtn,
    VVideo,
  },
})
