import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

export interface IOrg {
  name: string
  id: number
}

interface IOrgState {
  org?: IOrg
  setOrg: (org: IOrg) => void
  clear: () => void
}

export const useOrgState = create<IOrgState>()(
  devtools(
    persist(
      (set) => ({
        setOrg: (org) => set({ org }),
        clear: () => set({ org: undefined }),
      }),
      { name: "org-store", storage: createJSONStorage(() => sessionStorage) }
    )
  )
)
