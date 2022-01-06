---
extend: '@vue/cli-service/generator/template/src/App.vue'
replace:
  - !!js/regexp /\#app\s\{[^]*?<\/style>/
---

<%# REPLACE %>
</style>
<%# END_REPLACE %>
