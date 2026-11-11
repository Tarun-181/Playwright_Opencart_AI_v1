
export const routes = {

    BASE_URL: 'https://fakestoreapi.com',

    // Product Routes
    GET_ALL_PRODUCTS: '/products',
    GET_PRODUCT_BY_ID: (id: number) => `/products/${id}`,
    GET_PRODUCTS_WITH_LIMIT: (limit: number) => `/products?limit=${limit}`,
    GET_PRODUCTS_SORTED: (order: 'asc' | 'desc') => `/products?sort=${order}`,
    GET_ALL_CATEGORIES: '/products/categories',
    GET_PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
    CREATE_PRODUCT: '/products',
    UPDATE_PRODUCT: (id: number) => `/products/${id}`,
    DELETE_PRODUCT: (id: number) => `/products/${id}`,

    // User Routes
    GET_ALL_USERS: '/users',
    GET_USER_BY_ID: (id: number) => `/users/${id}`,
    GET_USERS_WITH_LIMIT: (limit: number) => `/users?limit=${limit}`,
    GET_USERS_SORTED: (order: 'asc' | 'desc') => `/users?sort=${order}`,
    CREATE_USER: '/users',
    UPDATE_USER: (id: number) => `/users/${id}`,
    DELETE_USER: (id: number) => `/users/${id}`,

    // Cart Routes
    GET_ALL_CARTS: '/carts',
    GET_CART_BY_ID: (id: number) => `/carts/${id}`,
    GET_CARTS_BY_DATE_RANGE: (startDate: string, endDate: string) => `/carts?startDate=${startDate}&endDate=${endDate}`,
    GET_USER_CART: (userId: number) => `/carts/user/${userId}`,
    GET_CARTS_WITH_LIMIT: (limit: number) => `/carts?limit=${limit}`,
    GET_CARTS_SORTED: (order: 'asc' | 'desc') => `/carts?sort=${order}`,
    CREATE_CART: '/carts',
    UPDATE_CART: (id: number) => `/carts/${id}`,
    DELETE_CART: (id: number) => `/carts/${id}`,

    //Authentication Routes

    AUTH_LOGIN: '/auth/login',    

};
