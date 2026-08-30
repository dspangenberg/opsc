import { usePage } from '@inertiajs/react'
import { PageContainer } from '@/Components/PageContainer'
import { TodoList } from '@/Components/Shared/Todo/TodoList'

interface Props {
  todos: App.Data.Paginated.PaginationMeta<App.Data.TodoData[]>
}

export default function TodoIndex({ todos }: Props) {
  const { auth } = usePage().props

  return (
    <PageContainer title="Todos" className="flex flex-1 w-full">
      <TodoList todos={todos.data} user={auth.user} />
    </PageContainer>
  )
}

