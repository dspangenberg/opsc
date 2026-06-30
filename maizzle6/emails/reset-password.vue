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
          Willkommen in der opsc.cloud von <Raw>{{$tenant}}</Raw>, <Raw>{{ $name }}</Raw>!
        </Heading>

        <Text class="mb-6 text-slate-600 dark:text-gray-300">
          Bevor es richtig losgeht, musst Du Deine E-Mail-Adresse bestätigen und ein Kennwort für Deinen Account festlegen.
        </Text>

        <Button
          href="{{ $resetUrl }}"
          class="hover:bg-indigo-600"
        >
          Kennwort festlegen
        </Button>

        <Spacer height="24px" />

        <Text class="m-0 text-slate-600 dark:text-gray-300">
          Freundliche Grüße aus Bonn<br/>
          twiceware solutions e. K.
        </Text>

        <Spacer height="24px" />

        <Text class="m-0 text-xs mso-break-all text-slate-600 dark:text-gray-400">
          Falls Du Probleme mit dem Button hast, kopiere und füge die folgende URL
          in Deinem Browser ein:
          <Link href="{{ $resetUrl }}" class="underline text-slate-800 dark:text-gray-400">
            <Raw>{{ $resetUrl }}</Raw>
          </Link>
        </Text>
      </Section>

    </Container>
  </Layout>
</template>
