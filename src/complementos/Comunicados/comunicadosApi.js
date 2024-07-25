export const fetchComunicadosContent = async () => {
    try {
      const response = await fetch('./comunicados.html');
      if (!response.ok) {
        throw new Error('Error fetching Comunicados content');
      }
      const content = await response.text();
      return content;
    } catch (err) {
      console.error('Error fetching Comunicados content:', err);
      throw new Error('Error loading Comunicados. Please try again later.');
    }
  };