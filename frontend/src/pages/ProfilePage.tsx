import { Box, ButtonBase } from '@mui/material'
import type { Theme } from '@mui/material'
import type { SystemStyleObject } from '@mui/system'
import { selectUser } from '@entities/user/model/selectors'
import { useAppSelector } from '@shared/hooks'
import { PostsList } from '@widgets/posts'
import { Profile, ProfileSkeleton } from '@widgets/profile'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { EditProfileModal, useGetUser } from '@features/profile'
import { useUserPosts } from '@features/posts'
import { PostSkeletonList } from '@entities/post'
import { EmptyState, StickyTopBar } from '@shared/ui'
import BackIcon from '@shared/assets/icons/icon-back.svg?react'
import { colors, transitions } from '@shared/styles'
import { plural } from '@shared/lib'
import { routes } from '@shared/config/routes'

export const ProfilePage = () => {
  const me = useAppSelector(selectUser)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const profileId = Number(id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const profileQuery = useGetUser(profileId)
  const postsQuery = useUserPosts(profileId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [profileId])

  if (!me) return null

  const profile = profileQuery.data
  const isOwnProfile = profile?.id === me.id
  const posts = postsQuery.data?.pages.flatMap(page => page.items) ?? []
  const postsCount = posts.length

  const handleNavigateBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(routes.feed)
    }
  }

  return (
    <Box sx={pageSx}>
      <StickyTopBar sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 1.5, py: 0.5 }}>
        <ButtonBase onClick={handleNavigateBack} sx={backButtonSx}>
          <Box component={BackIcon} sx={backIconSx} />
        </ButtonBase>
        {profile && (
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Box sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{profile.username}</Box>
            <Box sx={{ fontSize: 13, color: colors.textMuted }}>
              {postsCount} {plural(postsCount, { one: 'пост', few: 'поста', many: 'постов' })}
            </Box>
          </Box>
        )}
      </StickyTopBar>

      {profileQuery.isLoading || !profile ? (
        <ProfileSkeleton />
      ) : (
        <Profile
          user={profile}
          isOwnProfile={isOwnProfile}
          isAdmin={me.role === 'ADMIN'}
          onEditClick={() => setIsEditOpen(true)}
        />
      )}

      <Box sx={{ overflow: 'auto' }}>
        {postsQuery.isLoading ? (
          <PostSkeletonList />
        ) : posts.length === 0 ? (
          <EmptyState
            title={isOwnProfile ? 'У вас пока нет постов' : 'У пользователя пока нет постов'}
            hint={isOwnProfile ? 'Поделитесь чем-нибудь — это появится здесь' : undefined}
          />
        ) : (
          <PostsList
            posts={posts}
            showReport={!isOwnProfile}
            hasNextPage={postsQuery.hasNextPage}
            isFetchingNextPage={postsQuery.isFetchingNextPage}
            onLoadMore={() => postsQuery.fetchNextPage()}
          />
        )}
        {postsQuery.isFetchingNextPage && <PostSkeletonList count={2} />}
      </Box>

      <Box sx={{ flex: 1, minHeight: '50vh' }} />

      {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}
    </Box>
  )
}

const pageSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  borderRadius: '16px 16px 0 0',
}

const backButtonSx: SystemStyleObject<Theme> = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  color: colors.text,
  transition: transitions.background,
  '&:hover': {
    backgroundColor: colors.hoverBg,
  },
}

const backIconSx: SystemStyleObject<Theme> = {
  width: 22,
  height: 22,
  color: 'inherit',
  objectFit: 'cover',
}
