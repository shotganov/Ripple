import FlagIcon from '@shared/assets/icons/icon-report.svg?react'
import TrashIcon from '@shared/assets/icons/icon-trash.svg?react'
import { DropdownMenu, DropdownMenuItem } from '@shared/ui'
import { useDeleteComment } from '../hooks/useComment'

type Props = {
  postId: number
  commentId: number
  isOwnComment?: boolean
  isAdmin?: boolean
  showReport?: boolean
  onReport: () => void
}

export const CommentMenu = ({
  postId,
  commentId,
  isOwnComment = false,
  isAdmin = false,
  showReport = true,
  onReport,
}: Props) => {
  const deleteComment = useDeleteComment(postId)

  const canDelete = isOwnComment || isAdmin

  return (
    <DropdownMenu>
      {close =>
        canDelete ? (
          <DropdownMenuItem
            icon={TrashIcon}
            danger
            onClick={() => {
              if (deleteComment.isPending) return
              deleteComment.mutate(commentId)
              close()
            }}
          >
            Удалить комментарий
          </DropdownMenuItem>
        ) : (
          showReport && (
            <DropdownMenuItem
              icon={FlagIcon}
              onClick={() => {
                onReport()
                close()
              }}
            >
              Пожаловаться
            </DropdownMenuItem>
          )
        )
      }
    </DropdownMenu>
  )
}
