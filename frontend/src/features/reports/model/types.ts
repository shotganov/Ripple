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

export type ReportedPost = {
  id: number
  content: string
  images: string[]
  createdAt: string
  likes: number
  comments: number
  user: AdminUser
}

export type ReportedComment = {
  id: number
  content: string
  postId: number
  createdAt: string
  user: AdminUser
}

export type ReportGroup =
  | {
      type: 'post'
      targetId: number
      reportCount: number
      latestReportAt: string
      reasons: ReportReason[]
      post: ReportedPost | null
    }
  | {
      type: 'comment'
      targetId: number
      reportCount: number
      latestReportAt: string
      reasons: ReportReason[]
      comment: ReportedComment | null
    }
