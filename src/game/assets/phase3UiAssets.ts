/**
 * Phase 3 Semantic UI Assets Mapping
 * Paths strictly point to /assets/phase3-ui/
 * Includes dimensions and aspect ratios to prevent image stretching or distortion.
 */

export interface Phase3AssetMeta {
  path: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  label: string;
}

const createAsset = (
  path: string,
  width: number,
  height: number,
  label: string
): Phase3AssetMeta => ({
  path,
  src: path,
  width,
  height,
  aspectRatio: width / height,
  label,
});

// 1. All 28 Flat Semantic PNG Assets
export const RAW_PHASE3_ASSETS = {
  // Controls
  ui_close_dong: createAsset('/assets/phase3-ui/ui_close_dong.png', 320, 326, 'Đóng'),
  ui_cancel_huy: createAsset('/assets/phase3-ui/ui_cancel_huy.png', 380, 309, 'Hủy'),
  ui_back_quay_lai: createAsset('/assets/phase3-ui/ui_back_quay_lai.png', 525, 251, 'Quay lại'),
  ui_settings_cai_dat: createAsset('/assets/phase3-ui/ui_settings_cai_dat.png', 319, 318, 'Cài đặt'),
  ui_sfx_on: createAsset('/assets/phase3-ui/ui_sfx_on.png', 274, 277, 'SFX Bật'),
  ui_sfx_off: createAsset('/assets/phase3-ui/ui_sfx_off.png', 290, 275, 'SFX Tắt'),
  ui_bgm_on: createAsset('/assets/phase3-ui/ui_bgm_on.png', 300, 276, 'BGM Bật'),
  ui_bgm_off: createAsset('/assets/phase3-ui/ui_bgm_off.png', 275, 276, 'BGM Tắt'),
  ui_timer_thoi_gian: createAsset('/assets/phase3-ui/ui_timer_thoi_gian.png', 463, 232, 'Thời gian'),

  // Buttons
  btn_buy_mua: createAsset('/assets/phase3-ui/btn_buy_mua.png', 602, 263, 'Mua'),
  btn_open_mo: createAsset('/assets/phase3-ui/btn_open_mo.png', 593, 295, 'Mở'),
  btn_lock_khoa: createAsset('/assets/phase3-ui/btn_lock_khoa.png', 563, 255, 'Khóa'),
  btn_upgrade_nang_cap: createAsset('/assets/phase3-ui/btn_upgrade_nang_cap.png', 589, 279, 'Nâng cấp'),
  btn_start_bat_dau: createAsset('/assets/phase3-ui/btn_start_bat_dau.png', 622, 251, 'Bắt đầu'),
  btn_cook_nau: createAsset('/assets/phase3-ui/btn_cook_nau.png', 543, 270, 'Nấu'),
  btn_complete_hoan_tat: createAsset('/assets/phase3-ui/btn_complete_hoan_tat.png', 513, 196, 'Hoàn tất'),
  btn_serve_giao_mon: createAsset('/assets/phase3-ui/btn_serve_giao_mon.png', 480, 212, 'Giao món'),
  btn_free_cook_nau_tu_do: createAsset('/assets/phase3-ui/btn_free_cook_nau_tu_do.png', 476, 210, 'Nấu tự do'),
  btn_delivery_giao_hang: createAsset('/assets/phase3-ui/btn_delivery_giao_hang.png', 747, 251, 'Giao hàng'),
  btn_tray_khay: createAsset('/assets/phase3-ui/btn_tray_khay.png', 619, 254, 'Khay'),

  // Tabs
  tab_market_cho: createAsset('/assets/phase3-ui/tab_market_cho.png', 365, 226, 'Chợ'),
  tab_menu_thuc_don: createAsset('/assets/phase3-ui/tab_menu_thuc_don.png', 380, 240, 'Thực đơn'),
  tab_recipe_cong_thuc: createAsset('/assets/phase3-ui/tab_recipe_cong_thuc.png', 395, 229, 'Công thức'),
  tab_review_danh_gia: createAsset('/assets/phase3-ui/tab_review_danh_gia.png', 371, 225, 'Đánh giá'),

  // Status
  status_waiting_dang_cho: createAsset('/assets/phase3-ui/status_waiting_dang_cho.png', 343, 210, 'Đang chờ'),
  status_cooking_dang_nau: createAsset('/assets/phase3-ui/status_cooking_dang_nau.png', 450, 214, 'Đang nấu'),
  status_perfect_hoan_hao: createAsset('/assets/phase3-ui/status_perfect_hoan_hao.png', 375, 199, 'Hoàn hảo'),
  status_burned_qua_lua: createAsset('/assets/phase3-ui/status_burned_qua_lua.png', 330, 221, 'Quá lửa'),
};

// 2. Structured PHASE3_UI_ASSETS with both grouped and flat access
export const PHASE3_UI_ASSETS = {
  ...RAW_PHASE3_ASSETS,

  // Grouped access
  controls: {
    close: RAW_PHASE3_ASSETS.ui_close_dong,
    cancel: RAW_PHASE3_ASSETS.ui_cancel_huy,
    back: RAW_PHASE3_ASSETS.ui_back_quay_lai,
    settings: RAW_PHASE3_ASSETS.ui_settings_cai_dat,
    sfxOn: RAW_PHASE3_ASSETS.ui_sfx_on,
    sfxOff: RAW_PHASE3_ASSETS.ui_sfx_off,
    bgmOn: RAW_PHASE3_ASSETS.ui_bgm_on,
    bgmOff: RAW_PHASE3_ASSETS.ui_bgm_off,
    timer: RAW_PHASE3_ASSETS.ui_timer_thoi_gian,
  },
  buttons: {
    buy: RAW_PHASE3_ASSETS.btn_buy_mua,
    open: RAW_PHASE3_ASSETS.btn_open_mo,
    lock: RAW_PHASE3_ASSETS.btn_lock_khoa,
    upgrade: RAW_PHASE3_ASSETS.btn_upgrade_nang_cap,
    start: RAW_PHASE3_ASSETS.btn_start_bat_dau,
    cook: RAW_PHASE3_ASSETS.btn_cook_nau,
    complete: RAW_PHASE3_ASSETS.btn_complete_hoan_tat,
    serve: RAW_PHASE3_ASSETS.btn_serve_giao_mon,
    freeCook: RAW_PHASE3_ASSETS.btn_free_cook_nau_tu_do,
    delivery: RAW_PHASE3_ASSETS.btn_delivery_giao_hang,
    tray: RAW_PHASE3_ASSETS.btn_tray_khay,
  },
  tabs: {
    market: RAW_PHASE3_ASSETS.tab_market_cho,
    menu: RAW_PHASE3_ASSETS.tab_menu_thuc_don,
    recipe: RAW_PHASE3_ASSETS.tab_recipe_cong_thuc,
    review: RAW_PHASE3_ASSETS.tab_review_danh_gia,
  },
  status: {
    waiting: RAW_PHASE3_ASSETS.status_waiting_dang_cho,
    cooking: RAW_PHASE3_ASSETS.status_cooking_dang_nau,
    perfect: RAW_PHASE3_ASSETS.status_perfect_hoan_hao,
    burned: RAW_PHASE3_ASSETS.status_burned_qua_lua,
  },
};

/**
 * Direct flat mapping of all 28 Phase 3 assets by semantic key
 */
export const PHASE3_SEMANTIC_MAP: Record<string, Phase3AssetMeta> = {
  // Controls
  close: RAW_PHASE3_ASSETS.ui_close_dong,
  cancel: RAW_PHASE3_ASSETS.ui_cancel_huy,
  back: RAW_PHASE3_ASSETS.ui_back_quay_lai,
  settings: RAW_PHASE3_ASSETS.ui_settings_cai_dat,
  sfx_on: RAW_PHASE3_ASSETS.ui_sfx_on,
  sfx_off: RAW_PHASE3_ASSETS.ui_sfx_off,
  bgm_on: RAW_PHASE3_ASSETS.ui_bgm_on,
  bgm_off: RAW_PHASE3_ASSETS.ui_bgm_off,
  timer: RAW_PHASE3_ASSETS.ui_timer_thoi_gian,
  clock: RAW_PHASE3_ASSETS.ui_timer_thoi_gian,

  // Buttons
  buy: RAW_PHASE3_ASSETS.btn_buy_mua,
  open: RAW_PHASE3_ASSETS.btn_open_mo,
  lock: RAW_PHASE3_ASSETS.btn_lock_khoa,
  upgrade: RAW_PHASE3_ASSETS.btn_upgrade_nang_cap,
  start: RAW_PHASE3_ASSETS.btn_start_bat_dau,
  cook: RAW_PHASE3_ASSETS.btn_cook_nau,
  complete: RAW_PHASE3_ASSETS.btn_complete_hoan_tat,
  serve: RAW_PHASE3_ASSETS.btn_serve_giao_mon,
  free_cook: RAW_PHASE3_ASSETS.btn_free_cook_nau_tu_do,
  delivery: RAW_PHASE3_ASSETS.btn_delivery_giao_hang,
  tray: RAW_PHASE3_ASSETS.btn_tray_khay,

  // Tabs
  market: RAW_PHASE3_ASSETS.tab_market_cho,
  menu: RAW_PHASE3_ASSETS.tab_menu_thuc_don,
  recipe: RAW_PHASE3_ASSETS.tab_recipe_cong_thuc,
  review: RAW_PHASE3_ASSETS.tab_review_danh_gia,

  // Status
  waiting: RAW_PHASE3_ASSETS.status_waiting_dang_cho,
  cooking_status: RAW_PHASE3_ASSETS.status_cooking_dang_nau,
  perfect: RAW_PHASE3_ASSETS.status_perfect_hoan_hao,
  burned: RAW_PHASE3_ASSETS.status_burned_qua_lua,
};

export type Phase3SemanticKey = keyof typeof PHASE3_SEMANTIC_MAP;
