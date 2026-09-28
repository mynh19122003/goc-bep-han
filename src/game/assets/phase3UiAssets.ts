/**
 * Phase 3 Semantic UI Assets Mapping
 * Paths strictly point to /assets/phase3-ui/
 * Includes dimensions and aspect ratios to prevent image stretching or distortion.
 */

export interface Phase3AssetMeta {
  path: string;
  width: number;
  height: number;
  aspectRatio: number;
  label: string;
}

export const PHASE3_UI_ASSETS = {
  // Navigation & Control Buttons / Icons
  controls: {
    close: {
      path: '/assets/phase3-ui/ui_close_dong.png',
      width: 320,
      height: 326,
      aspectRatio: 320 / 326,
      label: 'Đóng',
    },
    cancel: {
      path: '/assets/phase3-ui/ui_cancel_huy.png',
      width: 380,
      height: 309,
      aspectRatio: 380 / 309,
      label: 'Hủy',
    },
    back: {
      path: '/assets/phase3-ui/ui_back_quay_lai.png',
      width: 525,
      height: 251,
      aspectRatio: 525 / 251,
      label: 'Quay lại',
    },
    settings: {
      path: '/assets/phase3-ui/ui_settings_cai_dat.png',
      width: 319,
      height: 318,
      aspectRatio: 319 / 318,
      label: 'Cài đặt',
    },
    sfxOn: {
      path: '/assets/phase3-ui/ui_sfx_on.png',
      width: 274,
      height: 277,
      aspectRatio: 274 / 277,
      label: 'SFX Bật',
    },
    sfxOff: {
      path: '/assets/phase3-ui/ui_sfx_off.png',
      width: 290,
      height: 275,
      aspectRatio: 290 / 275,
      label: 'SFX Tắt',
    },
    bgmOn: {
      path: '/assets/phase3-ui/ui_bgm_on.png',
      width: 300,
      height: 276,
      aspectRatio: 300 / 276,
      label: 'BGM Bật',
    },
    bgmOff: {
      path: '/assets/phase3-ui/ui_bgm_off.png',
      width: 275,
      height: 276,
      aspectRatio: 275 / 276,
      label: 'BGM Tắt',
    },
    timer: {
      path: '/assets/phase3-ui/ui_timer_thoi_gian.png',
      width: 463,
      height: 232,
      aspectRatio: 463 / 232,
      label: 'Thời gian',
    },
  },

  // Action Buttons
  buttons: {
    buy: {
      path: '/assets/phase3-ui/btn_buy_mua.png',
      width: 602,
      height: 263,
      aspectRatio: 602 / 263,
      label: 'Mua',
    },
    open: {
      path: '/assets/phase3-ui/btn_open_mo.png',
      width: 593,
      height: 295,
      aspectRatio: 593 / 295,
      label: 'Mở',
    },
    lock: {
      path: '/assets/phase3-ui/btn_lock_khoa.png',
      width: 563,
      height: 255,
      aspectRatio: 563 / 255,
      label: 'Khóa',
    },
    upgrade: {
      path: '/assets/phase3-ui/btn_upgrade_nang_cap.png',
      width: 589,
      height: 279,
      aspectRatio: 589 / 279,
      label: 'Nâng cấp',
    },
    start: {
      path: '/assets/phase3-ui/btn_start_bat_dau.png',
      width: 622,
      height: 251,
      aspectRatio: 622 / 251,
      label: 'Bắt đầu',
    },
    cook: {
      path: '/assets/phase3-ui/btn_cook_nau.png',
      width: 543,
      height: 270,
      aspectRatio: 543 / 270,
      label: 'Nấu',
    },
    complete: {
      path: '/assets/phase3-ui/btn_complete_hoan_tat.png',
      width: 513,
      height: 196,
      aspectRatio: 513 / 196,
      label: 'Hoàn tất',
    },
    serve: {
      path: '/assets/phase3-ui/btn_serve_giao_mon.png',
      width: 480,
      height: 212,
      aspectRatio: 480 / 212,
      label: 'Giao món',
    },
    freeCook: {
      path: '/assets/phase3-ui/btn_free_cook_nau_tu_do.png',
      width: 476,
      height: 210,
      aspectRatio: 476 / 210,
      label: 'Nấu tự do',
    },
    delivery: {
      path: '/assets/phase3-ui/btn_delivery_giao_hang.png',
      width: 747,
      height: 251,
      aspectRatio: 747 / 251,
      label: 'Giao hàng',
    },
    tray: {
      path: '/assets/phase3-ui/btn_tray_khay.png',
      width: 619,
      height: 254,
      aspectRatio: 619 / 254,
      label: 'Khay',
    },
  },

  // Tabs / Navigation Panels
  tabs: {
    market: {
      path: '/assets/phase3-ui/tab_market_cho.png',
      width: 365,
      height: 226,
      aspectRatio: 365 / 226,
      label: 'Chợ',
    },
    menu: {
      path: '/assets/phase3-ui/tab_menu_thuc_don.png',
      width: 380,
      height: 240,
      aspectRatio: 380 / 240,
      label: 'Thực đơn',
    },
    recipe: {
      path: '/assets/phase3-ui/tab_recipe_cong_thuc.png',
      width: 395,
      height: 229,
      aspectRatio: 395 / 229,
      label: 'Công thức',
    },
    review: {
      path: '/assets/phase3-ui/tab_review_danh_gia.png',
      width: 371,
      height: 225,
      aspectRatio: 371 / 225,
      label: 'Đánh giá',
    },
  },

  // Status Badges & Evaluation Tags
  status: {
    waiting: {
      path: '/assets/phase3-ui/status_waiting_dang_cho.png',
      width: 343,
      height: 210,
      aspectRatio: 343 / 210,
      label: 'Đang chờ',
    },
    cooking: {
      path: '/assets/phase3-ui/status_cooking_dang_nau.png',
      width: 450,
      height: 214,
      aspectRatio: 450 / 214,
      label: 'Đang nấu',
    },
    perfect: {
      path: '/assets/phase3-ui/status_perfect_hoan_hao.png',
      width: 375,
      height: 199,
      aspectRatio: 375 / 199,
      label: 'Hoàn hảo',
    },
    burned: {
      path: '/assets/phase3-ui/status_burned_qua_lua.png',
      width: 330,
      height: 221,
      aspectRatio: 330 / 221,
      label: 'Quá lửa',
    },
  },
} as const;

/**
 * Direct flat mapping of all 28 Phase 3 assets by semantic key
 */
export const PHASE3_SEMANTIC_MAP: Record<string, Phase3AssetMeta> = {
  // Controls
  close: PHASE3_UI_ASSETS.controls.close,
  cancel: PHASE3_UI_ASSETS.controls.cancel,
  back: PHASE3_UI_ASSETS.controls.back,
  settings: PHASE3_UI_ASSETS.controls.settings,
  sfx_on: PHASE3_UI_ASSETS.controls.sfxOn,
  sfx_off: PHASE3_UI_ASSETS.controls.sfxOff,
  bgm_on: PHASE3_UI_ASSETS.controls.bgmOn,
  bgm_off: PHASE3_UI_ASSETS.controls.bgmOff,
  timer: PHASE3_UI_ASSETS.controls.timer,
  clock: PHASE3_UI_ASSETS.controls.timer,

  // Buttons
  buy: PHASE3_UI_ASSETS.buttons.buy,
  open: PHASE3_UI_ASSETS.buttons.open,
  lock: PHASE3_UI_ASSETS.buttons.lock,
  upgrade: PHASE3_UI_ASSETS.buttons.upgrade,
  start: PHASE3_UI_ASSETS.buttons.start,
  cook: PHASE3_UI_ASSETS.buttons.cook,
  complete: PHASE3_UI_ASSETS.buttons.complete,
  serve: PHASE3_UI_ASSETS.buttons.serve,
  free_cook: PHASE3_UI_ASSETS.buttons.freeCook,
  delivery: PHASE3_UI_ASSETS.buttons.delivery,
  tray: PHASE3_UI_ASSETS.buttons.tray,

  // Tabs
  market: PHASE3_UI_ASSETS.tabs.market,
  menu: PHASE3_UI_ASSETS.tabs.menu,
  recipe: PHASE3_UI_ASSETS.tabs.recipe,
  review: PHASE3_UI_ASSETS.tabs.review,

  // Status
  waiting: PHASE3_UI_ASSETS.status.waiting,
  cooking_status: PHASE3_UI_ASSETS.status.cooking,
  perfect: PHASE3_UI_ASSETS.status.perfect,
  burned: PHASE3_UI_ASSETS.status.burned,
};

export type Phase3SemanticKey = keyof typeof PHASE3_SEMANTIC_MAP;
