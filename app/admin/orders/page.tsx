import prisma from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { 
      items: {
        include: {
          product: true
        }
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 bg-zinc-50 min-h-screen text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-10 uppercase italic border-l-8 border-red-600 pl-4">
          Журнал заказов
        </h1>
        
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 pb-4 border-b border-zinc-100">
                <div>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase mb-1">№ {order.orderNumber}</p>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{order.customerName}</h2>
                  <a href={`tel:${order.customerPhone}`} className="text-red-600 font-bold text-lg hover:underline">
                    {order.customerPhone}
                  </a>
                </div>
                <div className="mt-4 md:mt-0 md:text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-1">
                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </p>
                  <p className="text-3xl font-black italic">
                    {Number(order.totalAmount).toLocaleString()} ֏
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 border border-zinc-200 rounded-sm">
                <p className="text-[10px] font-black uppercase mb-3 text-zinc-500 tracking-widest">Список позиций:</p>
                <div className="space-y-2">
                  {order.items.map((item) => {
                    const price = Number(item.priceAtTime);
                    const qty = Number(item.quantity);
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm border-b border-zinc-200 pb-2 last:border-0 last:pb-0">
                        <span className="font-bold uppercase italic">
                          {item.product?.nameRu || "Товар удален"} 
                          <span className="text-zinc-400 not-italic ml-2 text-xs">x {qty}</span>
                        </span>
                        <span className="font-bold">
                          {(price * qty).toLocaleString()} ֏
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 bg-white border-2 border-dashed border-zinc-300">
              <p className="text-zinc-400 uppercase font-bold tracking-widest">Новых заказов пока нет</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}