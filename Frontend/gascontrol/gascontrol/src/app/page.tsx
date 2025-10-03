import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const basic = (await cookies()).get('basic')?.value;
  if (basic) {
    redirect('/relatorios');
  }
  redirect('/login');
}
