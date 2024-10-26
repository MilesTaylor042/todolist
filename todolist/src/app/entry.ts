export interface Entry {
    id: string
    contents: string
    completed: boolean
    parent?: Entry
}