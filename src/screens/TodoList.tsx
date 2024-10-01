import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTodoFilters } from '../components/hooks/useTodoFilters';
import { useTodos } from '../components/hooks/useTodos';
import { Icon } from '../components/common/Icon';
import { Alert } from 'react-native';
import { FilterType, SortByType, SortOrderType } from '../types/todo';

const TodoList: React.FC = () => {
  const { t } = useTranslation();
  const { todos, isLoading, error, addTodo, toggleTodo, deleteTodo, sortTodos } = useTodos();

  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortByType>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedTodos = useTodoFilters(todos, filter, searchQuery, sortBy, sortOrder);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortTodos(sortBy, newOrder);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('title')}</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder={t('addTodo')}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
            <Icon name="add" color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" color="#999" size={20} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchTodo')}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              onPress={() => setFilter(filterType)}
              style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive
              ]}
            >
              <Text style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive
              ]}>
                {t(`filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>{t('sortBy')}</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              setSortBy(sortBy === 'createdAt' ? 'title' : 'createdAt');
            }}
          >
            <Text style={styles.sortButtonText}>
              {t(sortBy === 'createdAt' ? 'sortDate' : 'sortTitle')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortOrderButton}
            onPress={handleSortOrderChange}
          >
            <Icon 
              name={sortOrder === 'asc' ? 'arrow-upward' : 'arrow-downward'}
              size={18} 
              color="#333"
            />
          </TouchableOpacity>
        </View>
        
        {filteredAndSortedTodos.length === 0 ? (
          <View style={styles.alert}>
            <Icon name='warning' color="#3b82f6" size={24} />
            <Text style={styles.alertTitle}>{t('noTodosFound')}</Text>
            <Text style={styles.alertDescription}>
              {t('noTodosDescription')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAndSortedTodos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.todoItem}>
                <TouchableOpacity onPress={() => toggleTodo(item.id)}>
                  {!item.completed ? (
                    <Icon name="circle" size={24} color="#9ca3af" />
                  ) : (
                    <Icon name='check-circle' color="#22c55e" size={24} />
                  )}
                </TouchableOpacity>
                <Text style={[
                  styles.todoTitle,
                  item.completed && styles.todoTitleCompleted
                ]}>
                  {item.title}
                </Text>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    t('confirmDeleteTitle'),
                    t('confirmDeleteMessage'),
                    [
                      { text: t('cancel'), style: 'cancel' },
                      { text: t('confirm'), onPress: () => deleteTodo(item.id) },
                    ],
                    { cancelable: false }
                  );
                }}>
                  <Icon name="delete" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4a90e2',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  sortButtonText: {
    color: '#333',
    fontSize: 14,
  },
  sortOrderButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  alert: {
    backgroundColor: '#e0f2fe',
    borderRadius: 5,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitle: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  alertDescription: {
    marginLeft: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  todoTitle: {
    flex: 1,
    marginLeft: 10,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
});

export default TodoList;