// Replaces dotpm's packages/ui/src/composites/cells/AssigneesCell.ts in the viewer bundle (see
// scripts/build-viewer.mjs): the task table lists assignees by full name instead of initial
// bubbles. Kanban and the other views keep dotpm's avatars. Imports resolve as they would
// from the original file.
import { displayName } from '@dotpm/core'
import { makeActivatable } from '#dom'
import type { AvatarPerson } from '#primitives/AvatarStack'

export class AssigneesCell {
  el: HTMLTableCellElement

  constructor(parentRow: HTMLElement, people: AvatarPerson[]) {
    this.el = parentRow.createEl('td', { cls: 'pm-table-cell pm-table-cell-assignees' })
    const list = this.el.createDiv('dotpm-people')
    for (const person of people) {
      const name = list.createSpan({ cls: 'dotpm-person', text: displayName(person.name) })
      if (person.unresolved) name.addClass('dotpm-person--unresolved')
      if (person.onClick) {
        name.addClass('dotpm-person--link')
        makeActivatable(name, person.onClick)
      }
    }
  }
}
