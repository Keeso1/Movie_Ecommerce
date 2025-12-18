import { auth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export default async function AdminDashboard() {
    const session = await auth.getSession();
    if (!session?.user || session.user.role !== 'admin') {
        return <p>Access denied.</p>;
    }

    const [totalOrders, totalRevenue, topMovies] = await Promise.all([
        prisma.order.count(),
        prisma.orderItem.aggregate({
            _sum: { priceAtPurchase: true },
        }),
        prisma.movie.findMany({
            where: { deleted: false },
            orderBy: { orderItems: { _count: 'desc' } },
            take: 5,
        }),
    ]);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold mb-2">Admin dashboard</h1>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="border border-slate-800 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Total orders</div>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                </div>
                <div className="border border-slate-800 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">
                        Total revenue (simulated)
                    </div>
                    <div className="text-2xl font-bold">
                        {Number(totalRevenue._sum.priceAtPurchase ?? 0).toFixed(2)} kr
                    </div>
                </div>
            </div>

            <section>
                <h2 className="text-lg font-semibold mb-2">Top 5 movies by sales</h2>
                <ul className="text-sm space-y-1">
                    {topMovies.map((m) => (
                        <li key={m.id}>
                            {m.title} – {Number(m.price).toFixed(2)} kr
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
