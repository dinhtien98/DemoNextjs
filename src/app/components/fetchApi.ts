/* eslint-disable @typescript-eslint/no-explicit-any */


export const getUser = async (token: string) => {

  try {
    const response = await fetch('http://localhost:5004/api/authUser', {
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

export const getPage = async (token: string) => {

  try {
    const response = await fetch('http://localhost:5004/api/authPage', {
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

export const getRole = async (token: string) => {

  try {
    const response = await fetch('http://localhost:5004/api/authRole', {
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

export const postUser = async (token: string, data: any) => {

  try {
    const response = await fetch('http://localhost:5004/api/authUser', {
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
    return 'User created';
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const deleteUser = async (token: string,id: any, data: any) => {

  try {
    const response = await fetch(`http://localhost:5004/api/authUser?id=${id}`, {
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
    return 'User deleted';
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}