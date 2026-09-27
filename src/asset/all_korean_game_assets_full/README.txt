BỘ ASSET GAME QUÁN ĂN HÀN QUỐC - FULL PACK

Nội dung:
- 01_curated_game_ui_food_props/: bộ asset đã được tách và đặt tên rõ ràng (UI, món ăn, nguyên liệu, props).
- 02_curated_customers_shippers_backgrounds/: khách hàng, shipper generic, background quán Hàn.
- 03_expanded_atlas/individual/: 214 ảnh tách tự động từ atlas mở rộng.
- 04_labeled_atlas/individual/: 197 ảnh tách tự động từ atlas có nhãn.
- 05_concept_atlas/individual/: 106 ảnh tách tự động từ concept sheet.
- 00_original_sheets/: toàn bộ ảnh sheet gốc để đối chiếu, không bị mất asset nào.

Gợi ý dùng trong Next.js:
- Copy các folder asset cần dùng vào public/assets/game/.
- Dùng URL dạng /assets/game/... thay vì import đường dẫn filesystem từ public.
- Nên ưu tiên 01_ và 02_ vì file đã được đặt tên theo nội dung. Các folder 03-05 dùng tên tuần tự vì được tách tự động từ sheet.

Lưu ý:
- Các sheet AI có một số chi tiết trang trí/liền nét nằm rất sát nhau, nên vài asset auto-slice có thể là một cụm nhỏ thay vì một vật thể tuyệt đối đơn lẻ. Toàn bộ source sheet vẫn được giữ trong pack để bạn đối chiếu hoặc cắt lại nếu muốn.
