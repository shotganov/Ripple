import LinkIcon from '@shared/assets/icons/icon-link.svg?react'
import FlagIcon from '@shared/assets/icons/icon-report.svg?react'
import TrashIcon from '@shared/assets/icons/icon-trash.svg?react'
import { routes } from '@shared/config/routes'
import { copyToClipboard } from '@shared/lib'
import { DropdownMenu, DropdownMenuItem } from '@shared/ui'
import { useDeletePost } from '../hooks/usePosts'

type Props = {
  postId: number
  isOwnPost?: boolean
  showReport?: boolean
  onReport: () => void
  onDeleted?: () => void
}

export const PostMenu = ({
  postId,
  isOwnPost = false,
  showReport = true,
  onReport,
  onDeleted,
}: Props) => {
  const deletePost = useDeletePost()

  return (
    <DropdownMenu>
      {close => (
        <>
          <DropdownMenuItem
            icon={LinkIcon}
            onClick={async () => {
              await copyToClipboard(`${window.location.origin}${routes.post(postId)}`)
              close()
            }}
          >
            Скопировать ссылку
          </DropdownMenuItem>
          {isOwnPost ? (
            <DropdownMenuItem
              icon={TrashIcon}
              danger
              onClick={() => {
                if (deletePost.isPending) return
                deletePost.mutate(postId, { onSuccess: () => onDeleted?.() })
                close()
              }}
            >
              Удалить пост
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
          )}
        </>
      )}
    </DropdownMenu>
  )
}
