<template>
  <div class="flex min-h-dvh flex-col">
    <!-- min-h-dvh (dynamic viewport height), not min-h-screen: avoids the
         classic mobile-browser layout jump as the address bar shows/hides. -->
    <OrganismsAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <OrganismsAppFooter />
  </div>
</template>
