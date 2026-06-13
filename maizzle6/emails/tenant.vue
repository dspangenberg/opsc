<script setup lang="ts">
</script>
<template>
  <Layout class="p-6 dark:bg-gray-950">
    <Container class="max-w-xl font-sans">
      <Section
        class="py-6 px-9 sm:px-6 bg-white dark:bg-gray-900 [border:1px_solid_var(--color-slate-200)] dark:border-gray-700 rounded-lg"
        mso-style="padding: 24px 36px; border: 1px solid #e2e8f0;"
      >

        <Text class="mb-6 text-slate-600 dark:text-gray-300">
          <Raw>{!! md(nl2br($content)) !!}</Raw>
          <Raw>{!! md($signature) !!}</Raw>
        </Text>


        <Spacer height="24px" />
      </Section>

    </Container>
  </Layout>
</template>
