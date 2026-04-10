import apiService, { BASE_URL } from './apiService';

const authService = {
  login: async (username, password, role) => {
    // role mapping logic from Android app
    let backendRole = 'DOCTOR';
    if (role === 'Consultant') backendRole = 'CONSULTANT';
    else if (role === 'Dental Assistant' || role === 'Assistant') backendRole = 'ASSISTANT';
    else if (role === 'Dental Intern' || role === 'Intern') backendRole = 'INTERN';
    else if (role === 'Admin' || role === 'System Admin') backendRole = 'ADMIN';

    const response = await apiService.post('api/auth/login/', {
      username,
      password,
      role: backendRole,
    });
    
    if (response.data && response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_role', role);
      // Fetch user profile after login
      await authService.getCurrentUser();
    }
    
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiService.get('api/users/me/');
    if (response.data) {
      const user = response.data;
      const fullName = user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.username;
      localStorage.setItem('user_full_name', fullName);
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('username', user.username);
      
      if (user.profile_picture) {
        const picUrl = user.profile_picture.startsWith('http') 
          ? user.profile_picture 
          : `${BASE_URL.replace(/\/$/, '')}${user.profile_picture}`;
        localStorage.setItem('user_profile_pic', picUrl);
      } else {
        localStorage.removeItem('user_profile_pic');
      }
      if (user.role) {
         // Map backend role back to display role if needed
         let displayRole = 'Dental Doctor';
         if (user.role === 'ADMIN') displayRole = 'Admin';
         else if (user.role === 'ASSISTANT') displayRole = 'Dental Assistant';
         else if (user.role === 'INTERN') displayRole = 'Dental Intern';
         else if (user.role === 'CONSULTANT') displayRole = 'Consultant';
         
         localStorage.setItem('user_role', displayRole);
         localStorage.setItem('backend_role', user.role);

         // Fetch granular permissions for this role
         try {
           const permResponse = await apiService.get(`api/role-permissions/${user.role}/`);
           if (permResponse.data) {
             localStorage.setItem('user_permissions', JSON.stringify(permResponse.data));
           }
         } catch (err) {
           console.error('Failed to fetch permissions:', err);
         }
      }
    }
    return response.data;
  },

  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

export default authService;
