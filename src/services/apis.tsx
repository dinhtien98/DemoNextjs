/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchGetData = async (token: string, endpoint: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchGetDataByID = async (token: string, endpoint: string, id: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchPostData = async (token: string, endpoint: string, data: any) => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return 'Successfully';
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchDeleteData = async (token: string, endpoint: string, id: any, data: any) => {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return 'Successfully';
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchPutData = async (token: string, endpoint: string,id: any, data: any) => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return 'Successfully';
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }