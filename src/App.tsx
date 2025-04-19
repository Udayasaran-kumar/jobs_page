import { StyleSheet, Text, View, FlatList, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const resp = await response.json();
      console.log("API Response:", resp);

      
      if (resp && Array.isArray(resp.results)) {
        setJob(prev => [...prev, ...resp.results]); 
      } else {
        setError('Page Ended,Please refresh or restart');  
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(`Error fetching data: ${error}`);  
    }
  };

 
  useEffect(() => {
    fetchData(page);
  }, [page]);

  const renderItem = ({ item }) => (
    <View style={styles.scrollBox}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.primary_details?.Place || 'Unknown Place'}</Text>
    </View>
  );


  if (error) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, rowGap: 10 }}>
      <StatusBar barStyle={'dark-content'} />
      <View style={{ marginTop: 30, justifyContent: 'center' }}>
        <Text style={{ fontSize: 25, textAlign: 'center' }}>Jobs</Text>
        <FlatList
          data={job}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReached={() => setPage(prev => prev + 1)} 
          ListFooterComponent={loading && <Text>Loading...</Text>}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  scrollBox: {
    height: 100,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
});
