import TaskDetailsPage from '@/components/TaskDetailsPage';

type Props = {
  params: Promise<{ taskId: string }>;
};

export default async function EmployeeTaskDetailsPage({ params }: Props) {
  const { taskId } = await params;
  return <TaskDetailsPage taskId={taskId} />;
}
