export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            accounts: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    balance: number
                    color: string
                    consistency_rule: number
                    profit_target: number
                    max_daily_loss: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    balance?: number
                    color?: string
                    consistency_rule?: number
                    profit_target?: number
                    max_daily_loss?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    balance?: number
                    color?: string
                    consistency_rule?: number
                    profit_target?: number
                    max_daily_loss?: number
                    created_at?: string
                }
                Relationships: []
            }
            trades: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    date: string
                    instrument: string
                    instrument_label: string | null
                    session: string | null
                    session_time: string | null
                    entry_time: string | null
                    exit_time: string | null
                    direction: "Long" | "Short"
                    contracts: number
                    entry_price: number
                    exit_price: number
                    risk_usd: number | null
                    risk_pts: number | null
                    reward_usd: number | null
                    reward_pts: number | null
                    rr_achieved: number | null
                    pnl: number
                    setup: string | null
                    a_plus_setup: "Yes" | "No" | null
                    trend_direction: "Uptrend" | "Downtrend" | "Range" | null
                    htf_bias: "Bullish" | "Bearish" | "Neutral" | null
                    entry_confirmation: "Valid" | "Invalid" | null
                    news_nearby: "Yes" | "No" | null
                    grade: "A" | "B" | "C" | "D" | "F" | null
                    confidence_before: number | null
                    emotions_before: string | null
                    emotions_after: string | null
                    followed_plan: "Yes" | "No" | null
                    revenge_trade: "Yes" | "No" | null
                    fomo: "Yes" | "No" | null
                    notes: string | null
                    entry_screenshot_url: string | null
                    exit_screenshot_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    date: string
                    instrument: string
                    instrument_label?: string | null
                    session?: string | null
                    session_time?: string | null
                    entry_time?: string | null
                    exit_time?: string | null
                    direction: "Long" | "Short"
                    contracts?: number
                    entry_price: number
                    exit_price: number
                    risk_usd?: number | null
                    risk_pts?: number | null
                    reward_usd?: number | null
                    reward_pts?: number | null
                    rr_achieved?: number | null
                    pnl?: number
                    setup?: string | null
                    a_plus_setup?: "Yes" | "No" | null
                    trend_direction?: "Uptrend" | "Downtrend" | "Range" | null
                    htf_bias?: "Bullish" | "Bearish" | "Neutral" | null
                    entry_confirmation?: "Valid" | "Invalid" | null
                    news_nearby?: "Yes" | "No" | null
                    grade?: "A" | "B" | "C" | "D" | "F" | null
                    confidence_before?: number | null
                    emotions_before?: string | null
                    emotions_after?: string | null
                    followed_plan?: "Yes" | "No" | null
                    revenge_trade?: "Yes" | "No" | null
                    fomo?: "Yes" | "No" | null
                    notes?: string | null
                    entry_screenshot_url?: string | null
                    exit_screenshot_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    account_id?: string
                    date?: string
                    instrument?: string
                    instrument_label?: string | null
                    session?: string | null
                    session_time?: string | null
                    entry_time?: string | null
                    exit_time?: string | null
                    direction?: "Long" | "Short"
                    contracts?: number
                    entry_price?: number
                    exit_price?: number
                    risk_usd?: number | null
                    risk_pts?: number | null
                    reward_usd?: number | null
                    reward_pts?: number | null
                    rr_achieved?: number | null
                    pnl?: number
                    setup?: string | null
                    a_plus_setup?: "Yes" | "No" | null
                    trend_direction?: "Uptrend" | "Downtrend" | "Range" | null
                    htf_bias?: "Bullish" | "Bearish" | "Neutral" | null
                    entry_confirmation?: "Valid" | "Invalid" | null
                    news_nearby?: "Yes" | "No" | null
                    grade?: "A" | "B" | "C" | "D" | "F" | null
                    confidence_before?: number | null
                    emotions_before?: string | null
                    emotions_after?: string | null
                    followed_plan?: "Yes" | "No" | null
                    revenge_trade?: "Yes" | "No" | null
                    fomo?: "Yes" | "No" | null
                    notes?: string | null
                    entry_screenshot_url?: string | null
                    exit_screenshot_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            setups: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    criteria: string | null
                    color: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    criteria?: string | null
                    color?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    criteria?: string | null
                    color?: string
                    created_at?: string
                }
                Relationships: []
            }
            daily_reviews: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    best_trade_label: string | null
                    best_trade_pnl: number | null
                    worst_mistake_label: string | null
                    worst_mistake_pnl: number | null
                    what_to_repeat: string | null
                    one_thing_to_improve: string | null
                    tomorrows_focus: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    best_trade_label?: string | null
                    best_trade_pnl?: number | null
                    worst_mistake_label?: string | null
                    worst_mistake_pnl?: number | null
                    what_to_repeat?: string | null
                    one_thing_to_improve?: string | null
                    tomorrows_focus?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    best_trade_label?: string | null
                    best_trade_pnl?: number | null
                    worst_mistake_label?: string | null
                    worst_mistake_pnl?: number | null
                    what_to_repeat?: string | null
                    one_thing_to_improve?: string | null
                    tomorrows_focus?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            reports: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    from_date: string
                    to_date: string
                    title: string | null
                    what_went_well: string | null
                    what_to_improve: string | null
                    focus_next: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    from_date: string
                    to_date: string
                    title?: string | null
                    what_went_well?: string | null
                    what_to_improve?: string | null
                    focus_next?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    account_id?: string
                    from_date?: string
                    to_date?: string
                    title?: string | null
                    what_went_well?: string | null
                    what_to_improve?: string | null
                    focus_next?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    category: "performance" | "process"
                    metric: string
                    title: string
                    target_value: number
                    direction: "at_least" | "at_most"
                    period: "week" | "month" | "quarter" | "all" | "custom"
                    from_date: string | null
                    to_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    category: "performance" | "process"
                    metric: string
                    title: string
                    target_value: number
                    direction: "at_least" | "at_most"
                    period: "week" | "month" | "quarter" | "all" | "custom"
                    from_date?: string | null
                    to_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    account_id?: string
                    category?: "performance" | "process"
                    metric?: string
                    title?: string
                    target_value?: number
                    direction?: "at_least" | "at_most"
                    period?: "week" | "month" | "quarter" | "all" | "custom"
                    from_date?: string | null
                    to_date?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            notes: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    trade_id: string | null
                    title: string
                    body: string
                    resolution: string
                    tags: string[]
                    pinned: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    trade_id?: string | null
                    title: string
                    body?: string
                    resolution?: string
                    tags?: string[]
                    pinned?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    account_id?: string
                    trade_id?: string | null
                    title?: string
                    body?: string
                    resolution?: string
                    tags?: string[]
                    pinned?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}