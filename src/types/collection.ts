export interface Collection {
    _id: string
    user_email: string
    name: string
    tags: string[]
    papers: string[]
    created_at: string
    updated_at: string
  }
  
  export interface Paper {
    _id: string
    user_email: string
    title: string
    date_published: string
  }
  