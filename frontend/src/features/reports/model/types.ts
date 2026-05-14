export type ReportReason =
  | 'SPAM'
  | 'FRAUD'
  | 'HARASSMENT'
  | 'VIOLENCE'
  | 'SHOCKING'
  | 'EXPLICIT'

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED'

export type ReportTarget =
  | { type: 'post'; id: number }
  | { type: 'comment'; id: number }

export const reportReasonLabels: Record<ReportReason, string> = {
  SPAM: 'Спам',
  FRAUD: 'Мошенничество',
  HARASSMENT: 'Оскорбления или травля',
  VIOLENCE: 'Призывы к насилию',
  SHOCKING: 'Жестокие или шокирующие материалы',
  EXPLICIT: 'Откровенные материалы',
}

export const reportReasons = Object.keys(reportReasonLabels) as ReportReason[]

export type AdminUser = {
  id: number
  username: string
  tag: string
  avatar: string
}

export type AdminReport = {
  id: number
  reason: ReportReason
  status: ReportStatus
  createdAt: string
  resolvedAt: string | null
  reporter: AdminUser
  post: {
    id: number
    content: string
    images: string[]
    createdAt: string
    likes: number
    comments: number
    user: AdminUser
  } | null
  comment: {
    id: number
    content: string
    postId: number
    user: AdminUser
  } | null
}
