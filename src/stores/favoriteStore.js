import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const useFavoriteStore = defineStore('favorite', {
    state: () => ({
        list: [],
        pendingFavoriteId: null
    }),
    actions: {
        async fetchFavorites() {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/Favorite/me`, {
                    withCredentials: true
                })
                this.list = res.data
            } catch (err) {
                console.warn('取得收藏失敗', err)
            }
        },
        async addFavorite(propertyId) {
            if (this.list.some(item => item.propertyId === propertyId)) {
                return { success: false, message: '已收藏過了' }
            }
            try {
                await axios.post(
                    `${API_BASE_URL}/api/Favorite/add`,
                    { propertyId },
                    { withCredentials: true }
                )
                await this.fetchFavorites()
            } catch (err) {
                console.error('加入收藏失敗', err)
            }
        },
        async removeFavorite(propertyId) {
            try {
                await axios.post(
                    `${API_BASE_URL}/api/Favorite/remove`,
                    { propertyId },
                    { withCredentials: true }
                )
                await this.fetchFavorites()
            } catch (err) {
                console.error('取消收藏失敗', err)
            }
        }
    }
})