import { BookOutlined, CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { PageAnnotation } from '../../mocks/pageAnnotations'

type PageAnnotationModeProps = {
  open: boolean
  annotation: PageAnnotation | null
  onToggle: () => void
}

type ButtonPosition = {
  x: number
  y: number
}

const STORAGE_KEY = 'admin-annotation-button-position'
const BUTTON_WIDTH = 132
const BUTTON_HEIGHT = 48
const EDGE_PADDING = 16
const DRAG_THRESHOLD = 6
const PANEL_GAP = 12
const PANEL_MAX_WIDTH = 420
const PANEL_MAX_HEIGHT = 680
const PANEL_MIN_HEIGHT = 320

function getDefaultPosition(): ButtonPosition {
  if (typeof window === 'undefined') {
    return { x: EDGE_PADDING, y: EDGE_PADDING }
  }

  return {
    x: window.innerWidth - BUTTON_WIDTH - 24,
    y: window.innerHeight - BUTTON_HEIGHT - 24,
  }
}

function clampPosition(position: ButtonPosition): ButtonPosition {
  if (typeof window === 'undefined') {
    return position
  }

  const maxX = Math.max(EDGE_PADDING, window.innerWidth - BUTTON_WIDTH - EDGE_PADDING)
  const maxY = Math.max(EDGE_PADDING, window.innerHeight - BUTTON_HEIGHT - EDGE_PADDING)

  return {
    x: Math.min(Math.max(position.x, EDGE_PADDING), maxX),
    y: Math.min(Math.max(position.y, EDGE_PADDING), maxY),
  }
}

export default function PageAnnotationMode({
  open,
  annotation,
  onToggle,
}: PageAnnotationModeProps) {
  const [buttonPosition, setButtonPosition] = useState<ButtonPosition>(getDefaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const dragStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    offsetX: number
    offsetY: number
    moved: boolean
  } | null>(null)
  const suppressClickRef = useRef(false)
  const dragTargetRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!savedValue) {
      setButtonPosition(clampPosition(getDefaultPosition()))
      return
    }

    try {
      const parsed = JSON.parse(savedValue) as ButtonPosition
      setButtonPosition(clampPosition(parsed))
    } catch {
      setButtonPosition(clampPosition(getDefaultPosition()))
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buttonPosition))
  }, [buttonPosition])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      setButtonPosition((current) => clampPosition(current))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragTargetRef.current = event.currentTarget
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - buttonPosition.x,
      offsetY: event.clientY - buttonPosition.y,
      moved: false,
    }
    setIsDragging(false)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY
    if (!dragState.moved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
      return
    }

    dragState.moved = true
    suppressClickRef.current = true
    setIsDragging(true)
    setButtonPosition(
      clampPosition({
        x: event.clientX - dragState.offsetX,
        y: event.clientY - dragState.offsetY,
      }),
    )
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    if (dragTargetRef.current?.hasPointerCapture(event.pointerId)) {
      dragTargetRef.current.releasePointerCapture(event.pointerId)
    }

    dragTargetRef.current = null
    dragStateRef.current = null
    setIsDragging(false)
  }

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    onToggle()
  }

  const panelStyle = (() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const panelWidth = Math.min(PANEL_MAX_WIDTH, Math.max(280, viewportWidth - EDGE_PADDING * 2))
    const availableHeight = viewportHeight - EDGE_PADDING * 2
    const buttonCenterX = buttonPosition.x + BUTTON_WIDTH / 2
    const unclampedLeft = buttonCenterX - panelWidth / 2
    const left = Math.min(
      Math.max(unclampedLeft, EDGE_PADDING),
      viewportWidth - panelWidth - EDGE_PADDING,
    )

    const belowSpace = viewportHeight - (buttonPosition.y + BUTTON_HEIGHT + PANEL_GAP) - EDGE_PADDING
    const aboveSpace = buttonPosition.y - PANEL_GAP - EDGE_PADDING
    const openBelowButton = belowSpace >= PANEL_MIN_HEIGHT || belowSpace >= aboveSpace
    const usableSpace = openBelowButton ? belowSpace : aboveSpace
    const panelHeight = Math.min(
      PANEL_MAX_HEIGHT,
      Math.max(Math.min(PANEL_MIN_HEIGHT, availableHeight), usableSpace),
    )
    const top = openBelowButton
      ? Math.max(
        EDGE_PADDING,
        Math.min(
          buttonPosition.y + BUTTON_HEIGHT + PANEL_GAP,
          viewportHeight - panelHeight - EDGE_PADDING,
        ),
      )
      : Math.max(EDGE_PADDING, buttonPosition.y - PANEL_GAP - panelHeight)

    return {
      left,
      top,
      width: panelWidth,
      height: panelHeight,
    }
  })()

  return (
    <>
      <button
        type="button"
        className={`annotation-toggle-button${open ? ' annotation-toggle-button-active' : ''}${isDragging ? ' annotation-toggle-button-dragging' : ''}`}
        style={{ left: buttonPosition.x, top: buttonPosition.y }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-pressed={open}
        aria-label={open ? '关闭注释模式' : '打开注释模式'}
      >
        {open ? <CloseOutlined /> : <BookOutlined />}
        <span>{open ? '关闭注释' : '查看注释'}</span>
      </button>

      {open ? (
        <aside className="annotation-panel" style={panelStyle} aria-label="页面注释说明">
          <div className="annotation-panel-header">
            <div>
              <h3>{annotation?.title ?? '页面说明'}</h3>
            </div>
            <Button type="text" icon={<CloseOutlined />} onClick={onToggle} />
          </div>

          <div className="annotation-panel-body">
            <p className="annotation-panel-intro">
              {annotation?.intro ?? '当前页面还没有补充字段说明。'}
            </p>

            {annotation?.sections.map((section) => (
              <section key={section.title} className="annotation-section">
                <div className="annotation-section-heading">
                  <h4>{section.title}</h4>
                  <p>{section.summary}</p>
                </div>

                <div className="annotation-item-list">
                  {section.items.map((item) => (
                    <article key={item.label} className="annotation-item-card">
                      <div className="annotation-item-title">{item.label}</div>
                      <div className="annotation-item-note">{item.note}</div>
                      <div className="annotation-item-logic">
                        <span>逻辑说明</span>
                        <p>{item.logic}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>
      ) : null}
    </>
  )
}
