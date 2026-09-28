'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { CloseButton } from '@/components/ui/game/CloseButton';

export const CookbookModal: React.FC = () => {
  const { activeModal, setActiveModal } = useGameStore();
  const [activeChapter, setActiveChapter] = useState<number>(1);

  if (activeModal !== 'cookbook') return null;

  const chapters = [
    {
      id: 1,
      title: 'Bí Kíp Tokbokki Daegu',
      iconName: 'pan',
      content: (
        <div className="space-y-2.5 text-xs text-stone-200 leading-relaxed font-baloo">
          <p className="font-black text-amber-200">
            Vị sốt sánh mịn cay ngọt đậm đà chuẩn Daegu đòi hỏi sự tỉ mỉ trong từng thao tác:
          </p>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-inner">
            <span className="font-black text-red-400 block">1. Tỷ lệ thìa sốt vàng:</span>
            <p>• <strong className="text-amber-300">2 thìa Tương ớt Gochujang:</strong> Tạo màu đỏ au và vị cay nồng ấm.</p>
            <p>• <strong className="text-amber-300">1 thìa Nước tương Jin:</strong> Tạo độ mặn bùi đậm đà sâu sắc.</p>
            <p>• <strong className="text-amber-300">1 thìa Đường kính:</strong> Tạo độ sánh kẹo và vị ngọt hậu quyến rũ.</p>
          </div>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1 shadow-inner">
            <span className="font-black text-amber-400 block">2. Canh nhiệt lửa chảo:</span>
            <p>• <strong className="text-amber-300">Chạm giữ (Hold)</strong> để bật lửa và khuấy đều chảo gang.</p>
            <p>• Nhấp nhả nhịp nhàng để giữ kim nhiệt độ trong <strong className="text-emerald-400">Vùng Xanh (50% - 80%)</strong>.</p>
            <p>• Tránh để kim chạm vạch 95% kẻo bánh gạo bị khét đắng!</p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Nghệ Thuật Cuộn Kimbap',
      iconName: 'board',
      content: (
        <div className="space-y-2.5 text-xs text-stone-200 leading-relaxed font-baloo">
          <p className="font-black text-amber-200">
            Cuộn Kimbap chuẩn Hàn đòi hỏi nhân đều và khoanh cắt sắc bén:
          </p>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-inner">
            <span className="font-black text-emerald-400 block">1. Thứ tự xếp nhân lên lá rong biển:</span>
            <p>• <strong className="text-amber-300">Cơm Dẻo:</strong> Dàn một lớp mỏng đều khắp mặt rong biển.</p>
            <p>• <strong className="text-amber-300">Cà Rốt + Dưa Leo:</strong> Tạo độ giòn thanh mát sảng khoái.</p>
            <p>• <strong className="text-amber-300">Trứng Gà + Chả Cá:</strong> Thêm vị béo bùi dinh dưỡng cân bằng.</p>
          </div>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1 shadow-inner">
            <span className="font-black text-teal-400 block">2. Vuốt cuộn & Cắt khoanh:</span>
            <p>• <strong className="text-amber-300">Vuốt Lên (Swipe Up):</strong> Siết chặt mành tre để cuộn cơm chắc nịch.</p>
            <p>• <strong className="text-amber-300">Vuốt Ngang (Swipe Across):</strong> Lướt dao cắt đều 8 khoanh tròn tăm tắp!</p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Tô Mì Ramyeon & Mì Cay',
      iconName: 'pot',
      content: (
        <div className="space-y-2.5 text-xs text-stone-200 leading-relaxed font-baloo">
          <p className="font-black text-amber-200">
            Nấu mì Ramyeon và Mì Cay 7 Cấp Độ chuẩn vị Seoul:
          </p>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-inner">
            <span className="font-black text-amber-400 block">1. Canh mực nước Dashi:</span>
            <p>• Chạm giữ để đong nước đạt đúng <strong className="text-emerald-400">vạch chuẩn 75%</strong>.</p>
            <p>• Nước quá ít sẽ bị mặn, nước quá nhiều sẽ loãng mất vị đậm đà.</p>
          </div>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1 shadow-inner">
            <span className="font-black text-yellow-400 block">2. Chọn Topping & Độ Cay:</span>
            <p>• Đọc kỹ yêu cầu topping của khách (Bò Mỹ, xúc xích, nấm, kim chi).</p>
            <p>• Chỉnh đúng cấp độ cay bằng nút [+] và [-] với biểu tượng ớt đỏ.</p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Mặc Cả Chợ Sớm',
      iconName: 'cart',
      content: (
        <div className="space-y-2.5 text-xs text-stone-200 leading-relaxed font-baloo">
          <p className="font-black text-amber-200">
            Chợ đầu mối Noryangjin biến động giá mỗi sáng theo thời tiết:
          </p>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-inner">
            <span className="font-black text-orange-400 block">1. Đọc báo buổi sáng:</span>
            <p>• Trời nắng ấm: Rau củ, dưa leo, cà rốt giảm giá sâu (-20%).</p>
            <p>• Biển động: Chả cá, rong biển tăng giá (+25%). Hãy tranh thủ gom hàng rẻ!</p>
          </div>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1 shadow-inner">
            <span className="font-black text-amber-400 block">2. Kỹ năng mặc cả nhịp điệu:</span>
            <p>• Dừng kim ở <strong className="text-emerald-400">vạch xanh (80-100%)</strong> để nhận giảm giá sốc tới 20%.</p>
            <p>• Cẩn thận: Dừng vào vùng đỏ sẽ bị mắng và từ chối bán cả ngày!</p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Đơn Giao Tận Nơi',
      iconName: 'delivery',
      content: (
        <div className="space-y-2.5 text-xs text-stone-200 leading-relaxed font-baloo">
          <p className="font-black text-amber-200">
            Đơn đặt qua ứng dụng giao hàng đem lại nguồn doanh thu bùng nổ:
          </p>
          <div className="bg-stone-950/80 border-2 border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-inner">
            <p>• Khi chuông điện thoại reo, kiểm tra mã đơn (ví dụ <strong className="text-amber-300">#DH-802</strong>).</p>
            <p>• Tranh thủ nấu món trước khi Shipper tới cửa.</p>
            <p>• Khi Shipper xuất hiện, bấm <strong className="text-emerald-400">"Giao cho Shipper"</strong> để nhận thêm tiền tip!</p>
            <p>• Giao trễ khiến Shipper hủy đơn sẽ bị đánh giá 1 sao trên bảng nhận xét.</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-stone-900 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border-4 border-amber-600/60 relative flex flex-col max-h-[88vh] text-stone-100"
        >
          <CloseButton
            onClick={() => setActiveModal('none')}
            label="Đóng"
            className="absolute top-3 right-3 sm:top-4 sm:right-4"
          />

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <GameAssetIcon name="recipe" size={24} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-wide uppercase">
                SỔ TAY BÍ QUYẾT ĐẦU BẾP
              </h2>
              <p className="text-[11px] text-amber-300/80 font-bold">
                Cẩm nang toàn tập bí kíp nấu ăn, mặc cả và quản lý quán ăn Hàn
              </p>
            </div>
          </div>

          {/* Chapters Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-800 mb-3 shrink-0">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapter(ch.id)}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  activeChapter === ch.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md border border-amber-300'
                    : 'bg-stone-800 hover:bg-stone-750 text-stone-400 border border-stone-700'
                }`}
              >
                <GameAssetIcon name={ch.iconName} size={14} />
                <span>{ch.title}</span>
              </button>
            ))}
          </div>

          {/* Active Chapter Content */}
          <div className="overflow-y-auto flex-1 pr-1">
            {chapters.find((ch) => ch.id === activeChapter)?.content}
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2.5 border-t border-stone-800 text-center flex items-center justify-center gap-1.5">
            <GameAssetIcon name="lantern" size={16} />
            <span className="text-[11px] text-amber-300/80 font-bold">
              Thực hành thành thạo các bí kíp trên để đạt chuẩn 5.0 Sao toàn Seoul!
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
