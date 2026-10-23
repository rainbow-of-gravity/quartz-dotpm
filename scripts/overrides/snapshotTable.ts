// Replaces dotpm's packages/ui/src/views/snapshotTable.ts in the viewer bundle (see
// scripts/build-viewer.mjs). dotpm's snapshot table is fully read-only; the site keeps its
// rendering and adds what a reader needs: sorting by clicking a header (as dotpm's own table
// does), collapsing subtasks, and a class on subtask rows so they can be shaded. Imports
// resolve as they would from the original file; `dotpm-original:` loads the original.
import { MAX_SORT_RULES, SORT_KEYS, shownFields, t } from '@dotpm/core'
import { fieldCatalogOf, type ViewModel } from './model'
import { renderSnapshotTable as renderReadOnly, tableRows } from 'dotpm-original:./snapshotTable'

export { tableRows, visibleTaskCount } from 'dotpm-original:./snapshotTable'

/** Collapsed tasks per mounted view, kept across repaints and view switches. */
const collapsedByModel = new WeakMap<ViewModel, Set<string>>()

export function renderSnapshotTable(container: HTMLElement, model: ViewModel): HTMLElement {
  const wrapper = renderReadOnly(container, model)
  const repaint = (): void => {
    wrapper.replaceWith(renderSnapshotTable(container, model))
  }
  makeSortable(wrapper, model, repaint)
  makeCollapsible(wrapper, model)
  return wrapper
}

/** Click a header to sort by it, again to reverse; shift-click adds it as a further rule. */
function makeSortable(wrapper: HTMLElement, model: ViewModel, repaint: () => void): void {
  const columns = shownFields(model.fields, 'table', fieldCatalogOf(model))
  // The first header is the expand column.
  const headers = Array.from(wrapper.querySelectorAll<HTMLElement>('thead th')).slice(1)
  columns.forEach((id, i) => {
    const key = SORT_KEYS.find((k) => k === id)
    const th = headers[i]
    if (!key || !th) return
    th.addClass('pm-table-th-sortable')
    th.setAttr('role', 'button')
    th.setAttr('tabindex', '0')
    const sortBy = (additive: boolean): void => {
      const { sort } = model
      const at = sort.findIndex((rule) => rule.key === key)
      if (additive) {
        if (at >= 0) sort[at] = { key, dir: sort[at].dir === 'asc' ? 'desc' : 'asc' }
        else if (sort.length < MAX_SORT_RULES) sort.push({ key, dir: 'asc' })
      } else {
        const dir = at === 0 && sort[0].dir === 'asc' ? 'desc' : 'asc'
        const rest = sort.filter((rule, j) => j > 0 && rule.key !== key)
        sort.splice(0, sort.length, { key, dir }, ...rest)
      }
      repaint()
    }
    th.addEventListener('click', (e) => sortBy(e.shiftKey))
    th.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      sortBy(e.shiftKey)
    })
  })
}

/** The rows follow tableRows' order, so each row's parent is known from it. */
function makeCollapsible(wrapper: HTMLElement, model: ViewModel): void {
  let collapsed = collapsedByModel.get(model)
  if (!collapsed) collapsedByModel.set(model, (collapsed = new Set()))
  const collapsedIds = collapsed
  const rows = tableRows(model)
  const trs = Array.from(wrapper.querySelectorAll<HTMLTableRowElement>('tbody tr.pm-table-row'))
  const subject = t('collapse.subtasks')

  const apply = (): void => {
    const hidden = new Set<string>()
    rows.forEach((row, i) => {
      const tr = trs[i]
      if (!tr) return
      const { parentId } = row
      const isHidden = parentId !== null && (collapsedIds.has(parentId) || hidden.has(parentId))
      if (isHidden) hidden.add(row.task.id)
      tr.toggleClass('dotpm-row-hidden', isHidden)
      const toggle = tr.querySelector<HTMLElement>('.pm-collapse-toggle')
      if (!toggle) return
      const isCollapsed = collapsedIds.has(row.task.id)
      toggle.toggleClass('is-collapsed', isCollapsed)
      toggle.setAttr('aria-label', t(isCollapsed ? 'collapse.expand' : 'collapse.collapse', { subject }))
    })
  }

  rows.forEach((row, i) => {
    const tr = trs[i]
    if (!tr) return
    if (row.depth > 0) tr.addClass('dotpm-subtask-row')
    const toggle = tr.querySelector<HTMLElement>('.pm-collapse-toggle')
    if (!toggle) return
    toggle.setAttr('role', 'button')
    toggle.setAttr('tabindex', '0')
    const flip = (e: Event): void => {
      // The row itself opens the task; the toggle only folds it.
      e.preventDefault()
      e.stopPropagation()
      if (!collapsedIds.delete(row.task.id)) collapsedIds.add(row.task.id)
      apply()
    }
    toggle.addEventListener('click', flip)
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') flip(e)
    })
  })
  apply()
}
