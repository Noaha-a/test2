import request from '@/utils/request'

// 分类
export const getArtChannelService = () => {
  return request.get('/my/cate/list')
}

export const editArtChannelService = (data) => {
  return request.put('/my/cate/info', data)
}

export const addArtChannelService = (data) => {
  return request.post('/my/cate/add', data)
}

export const delArtChannelService = (id) => {
  return request.delete('/my/cate/del', { params: { id } })
}

// 管理
export const getArticleSerive = (params) => {
  return request.get('/my/article/list', { params })
}

export const addArticleService = (data) => {
  return request.post('/my/article/add', data)
}

export const getArtDetailService = id => {
  return request.get('/my/article/info', { params: { id } })
}

export const updateArtService = (data) => {
  return request.put('/my/article/info', data)
}

export const delArticleService = id => {
  return request.delete('/my/article/info', { params: { id } })
}