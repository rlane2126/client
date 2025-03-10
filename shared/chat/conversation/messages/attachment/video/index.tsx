import * as React from 'react'
import * as Kb from '../../../../../common-adapters'
import * as Styles from '../../../../../styles'
import VideoImpl from './videoimpl'
import {Title, useAttachmentRedux, Collapsed, useCollapseIcon} from '../shared'

type Props = {
  toggleMessageMenu: () => void
  isHighlighted?: boolean
}

const Transferring = (p: {ratio: number}) => {
  const {ratio} = p
  return (
    <Kb.Box2
      direction="horizontal"
      style={styles.transferring}
      alignItems="center"
      gap="xtiny"
      gapEnd={true}
      gapStart={true}
    >
      <Kb.Text type="BodySmall" negative={true}>
        Uploading
      </Kb.Text>
      <Kb.ProgressBar ratio={ratio} />
    </Kb.Box2>
  )
}

const Video = React.memo(function Video(p: Props) {
  const {isHighlighted, toggleMessageMenu} = p
  const {fileName, isCollapsed, showTitle, openFullscreen, transferState, transferProgress} =
    useAttachmentRedux()
  const containerStyle = isHighlighted ? styles.containerHighlighted : styles.container
  const isUploading = transferState === 'uploading'
  const collapseIcon = useCollapseIcon(false)

  const filename = React.useMemo(() => {
    return Styles.isMobile || !fileName ? null : (
      <Kb.Box2 direction="horizontal" alignSelf="flex-start" gap="xtiny">
        <Kb.Text type="BodySmall">{fileName}</Kb.Text>
        {collapseIcon}
      </Kb.Box2>
    )
  }, [collapseIcon, fileName])

  const content = React.useMemo(() => {
    return (
      <>
        {filename}
        <Kb.Box2
          direction="vertical"
          style={styles.contentContainer}
          alignSelf="flex-start"
          alignItems="flex-start"
          gap="xxtiny"
        >
          <VideoImpl
            openFullscreen={openFullscreen}
            toggleMessageMenu={toggleMessageMenu}
            allowPlay={transferState !== 'uploading'}
          />
          {showTitle ? <Title /> : null}
          {isUploading ? <Transferring ratio={transferProgress} /> : null}
        </Kb.Box2>
      </>
    )
  }, [openFullscreen, toggleMessageMenu, showTitle, filename, isUploading, transferProgress, transferState])

  return (
    <Kb.Box2 direction="vertical" fullWidth={true} style={containerStyle} alignItems="flex-start">
      {isCollapsed ? <Collapsed /> : content}
    </Kb.Box2>
  )
})

const styles = Styles.styleSheetCreate(
  () =>
    ({
      container: {alignSelf: 'center', paddingRight: Styles.globalMargins.tiny, position: 'relative'},
      containerHighlighted: {
        alignSelf: 'center',
        backgroundColor: Styles.globalColors.yellowLight,
        paddingRight: Styles.globalMargins.tiny,
      },
      contentContainer: {
        backgroundColor: Styles.globalColors.black_05_on_white,
        borderRadius: Styles.borderRadius,
        maxWidth: Styles.isMobile ? '100%' : 330,
        padding: 3,
        position: 'relative',
      },
      transferring: {
        backgroundColor: Styles.globalColors.black_50,
        borderRadius: 2,
        left: Styles.globalMargins.tiny,
        overflow: 'hidden',
        position: 'absolute',
        top: Styles.globalMargins.tiny,
      },
    } as const)
)

export default Video
