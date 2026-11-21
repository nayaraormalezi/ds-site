"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED } from "./seed";
import type {
  Asset,
  AssetStatus,
  Campaign,
  Category,
  DamStore,
  MaterialRequest,
  RequestStatus,
  User,
} from "./types";
import { uid } from "./utils";

const STORAGE_KEY = "cx-consorcio-dam-v1";

type StoreContextValue = {
  ready: boolean;
  store: DamStore;
  currentUser: User;
  resetDemo: () => void;
  toggleFavorite: (assetId: string) => void;
  setCurrentUser: (userId: string) => void;
  recordDownload: (assetId: string) => void;
  upsertAsset: (asset: Asset, activity?: string) => void;
  setAssetStatus: (assetId: string, status: AssetStatus) => void;
  deleteAsset: (assetId: string) => void;
  duplicateAsset: (assetId: string) => void;
  upsertCampaign: (campaign: Campaign) => void;
  upsertCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  addRequest: (input: Omit<MaterialRequest, "id" | "createdAt" | "updatedAt" | "status">) => void;
  upsertUser: (user: User) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function loadStore(): DamStore {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw) as DamStore;
    if (!parsed?.assets?.length) return structuredClone(SEED);
    return parsed;
  } catch {
    return structuredClone(SEED);
  }
}

function persist(store: DamStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function pushActivity(
  store: DamStore,
  partial: Omit<DamStore["activities"][number], "id" | "createdAt" | "userId"> & {
    userId?: string;
  }
): DamStore {
  return {
    ...store,
    activities: [
      {
        id: uid("act"),
        createdAt: new Date().toISOString(),
        userId: partial.userId ?? store.currentUserId,
        ...partial,
      },
      ...store.activities,
    ].slice(0, 200),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DamStore>(SEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setReady(true);
  }, []);

  const commit = useCallback((updater: (prev: DamStore) => DamStore) => {
    setStore((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const currentUser = useMemo(
    () => store.users.find((u) => u.id === store.currentUserId) ?? store.users[0],
    [store.users, store.currentUserId]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      ready,
      store,
      currentUser,
      resetDemo: () => {
        const fresh = structuredClone(SEED);
        persist(fresh);
        setStore(fresh);
      },
      toggleFavorite: (assetId) =>
        commit((prev) => ({
          ...prev,
          favorites: prev.favorites.includes(assetId)
            ? prev.favorites.filter((id) => id !== assetId)
            : [...prev.favorites, assetId],
        })),
      setCurrentUser: (userId) =>
        commit((prev) => ({ ...prev, currentUserId: userId })),
      recordDownload: (assetId) =>
        commit((prev) => ({
          ...prev,
          assets: prev.assets.map((a) =>
            a.id === assetId ? { ...a, downloads: a.downloads + 1 } : a
          ),
        })),
      upsertAsset: (asset, activity = "salvou") =>
        commit((prev) => {
          const exists = prev.assets.some((a) => a.id === asset.id);
          const assets = exists
            ? prev.assets.map((a) => (a.id === asset.id ? asset : a))
            : [asset, ...prev.assets];
          return pushActivity(
            { ...prev, assets },
            {
              action: exists ? activity : "cadastrou",
              entityType: "asset",
              entityId: asset.id,
              entityName: asset.name,
            }
          );
        }),
      setAssetStatus: (assetId, status) =>
        commit((prev) => {
          const asset = prev.assets.find((a) => a.id === assetId);
          if (!asset) return prev;
          const nextAsset = {
            ...asset,
            status,
            updatedAt: new Date().toISOString().slice(0, 10),
          };
          return pushActivity(
            {
              ...prev,
              assets: prev.assets.map((a) => (a.id === assetId ? nextAsset : a)),
            },
            {
              action: `alterou status para ${status}`,
              entityType: "asset",
              entityId: assetId,
              entityName: asset.name,
            }
          );
        }),
      deleteAsset: (assetId) =>
        commit((prev) => {
          const asset = prev.assets.find((a) => a.id === assetId);
          if (!asset) return prev;
          return pushActivity(
            {
              ...prev,
              assets: prev.assets.filter((a) => a.id !== assetId),
              favorites: prev.favorites.filter((id) => id !== assetId),
              campaigns: prev.campaigns.map((c) => ({
                ...c,
                assetIds: c.assetIds.filter((id) => id !== assetId),
              })),
            },
            {
              action: "excluiu",
              entityType: "asset",
              entityId: assetId,
              entityName: asset.name,
            }
          );
        }),
      duplicateAsset: (assetId) =>
        commit((prev) => {
          const asset = prev.assets.find((a) => a.id === assetId);
          if (!asset) return prev;
          const copy: Asset = {
            ...structuredClone(asset),
            id: uid("asset"),
            name: `${asset.name} (cópia)`,
            status: "em_revisao",
            version: "0.1",
            downloads: 0,
            featured: false,
            publishedAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
          };
          return pushActivity(
            { ...prev, assets: [copy, ...prev.assets] },
            {
              action: "duplicou",
              entityType: "asset",
              entityId: copy.id,
              entityName: copy.name,
            }
          );
        }),
      upsertCampaign: (campaign) =>
        commit((prev) => {
          const exists = prev.campaigns.some((c) => c.id === campaign.id);
          const campaigns = exists
            ? prev.campaigns.map((c) => (c.id === campaign.id ? campaign : c))
            : [campaign, ...prev.campaigns];
          return pushActivity(
            { ...prev, campaigns },
            {
              action: exists ? "atualizou campanha" : "criou campanha",
              entityType: "campaign",
              entityId: campaign.id,
              entityName: campaign.name,
            }
          );
        }),
      upsertCategory: (category) =>
        commit((prev) => {
          const exists = prev.categories.some((c) => c.id === category.id);
          return {
            ...prev,
            categories: exists
              ? prev.categories.map((c) => (c.id === category.id ? category : c))
              : [...prev.categories, category],
          };
        }),
      deleteCategory: (categoryId) =>
        commit((prev) => ({
          ...prev,
          categories: prev.categories.filter((c) => c.id !== categoryId),
        })),
      updateRequestStatus: (requestId, status) =>
        commit((prev) => {
          const request = prev.requests.find((r) => r.id === requestId);
          if (!request) return prev;
          return pushActivity(
            {
              ...prev,
              requests: prev.requests.map((r) =>
                r.id === requestId
                  ? {
                      ...r,
                      status,
                      updatedAt: new Date().toISOString().slice(0, 10),
                    }
                  : r
              ),
            },
            {
              action: `atualizou solicitação (${status})`,
              entityType: "request",
              entityId: requestId,
              entityName: request.title,
            }
          );
        }),
      addRequest: (input) =>
        commit((prev) => {
          const request: MaterialRequest = {
            ...input,
            id: uid("req"),
            status: "recebida",
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
          };
          return pushActivity(
            { ...prev, requests: [request, ...prev.requests] },
            {
              action: "criou solicitação",
              entityType: "request",
              entityId: request.id,
              entityName: request.title,
              userId: input.requesterId,
            }
          );
        }),
      upsertUser: (user) =>
        commit((prev) => {
          const exists = prev.users.some((u) => u.id === user.id);
          return {
            ...prev,
            users: exists
              ? prev.users.map((u) => (u.id === user.id ? user : u))
              : [...prev.users, user],
          };
        }),
    }),
    [ready, store, currentUser, commit]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
