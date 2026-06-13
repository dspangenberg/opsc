<script setup lang="ts">
</script>
<template>
  <Layout class="p-6 dark:bg-gray-950">
    <Container class="max-w-xl font-sans">
      <Section
        class="py-6 px-9 sm:px-6 bg-white dark:bg-gray-900 [border:1px_solid_var(--color-slate-200)] dark:border-gray-700 rounded-lg"
        mso-style="padding: 24px 36px; border: 1px solid #e2e8f0;"
      >


        <Heading level="1" class="mb-6 text-xl font-semibold text-slate-900 dark:text-gray-300">
          <Raw>
            @if($name)
              Guten Tag, {{ $name }},
            @else
              Guten Tag,
            @endif
          </Raw>
        </Heading>

        <Text class="mb-6 text-slate-600 dark:text-gray-300">
          <Raw>
            im Anhang dieser E-Mail senden wir Ihnen die {{ $type }} für unsere Rechnung {{ $invoice_number }} vom {{ $invoice_date }} im PDF-Format.
          </Raw>
        </Text>


        <Spacer height="24px" />
        <Text class="m-0 text-slate-600 dark:text-gray-300">
          <Raw>
            Freundliche Grüße nach {{ $city }}<br/>
            twiceware solutions e. K.
          </Raw>
        </Text>

      </Section>
    </Container>
  </Layout>
</template>
