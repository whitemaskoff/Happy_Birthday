import { useRive, useStateMachineInput } from '@rive-app/react-canvas'

export default function RiveCompanion({ src }) {
  const { rive, RiveComponent } = useRive({
    src,
    autoplay: true,
    stateMachines: 'State Machine 1',
  })
  const hover = useStateMachineInput(rive, 'State Machine 1', 'Hover')
  const pressed = useStateMachineInput(rive, 'State Machine 1', 'Pressed')

  return (
    <div
      className="h-full w-full"
      onPointerEnter={() => {
        if (hover) hover.value = true
      }}
      onPointerLeave={() => {
        if (hover) hover.value = false
      }}
      onPointerDown={() => {
        if (pressed) pressed.value = true
      }}
      onPointerUp={() => {
        if (pressed) pressed.value = false
      }}
    >
      <RiveComponent className="h-full w-full" />
    </div>
  )
}
