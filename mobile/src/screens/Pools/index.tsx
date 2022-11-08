import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { PoolCard, PoolCardProps } from '../../components/PoolCard';
import { Loading } from '../../components/Loading';
import { api } from '../../services/api';
import { EmptyPoolList } from '../../components/EmptyPoolList';

export function Pools() {
	const [isLoading, setIsLoading] = useState(true);
	const [pools, setPools] = useState<PoolCardProps[]>([]);
	const { navigate } = useNavigation();
	const toast = useToast();

	useFocusEffect(
		useCallback(() => {
			fetchPools();
		}, [])
	);

	async function fetchPools() {
		try {
			setIsLoading(true);
			const response = await api.get('pools');
			setPools(response.data.pools);
		} catch (error) {
			console.log(error);
			return toast.show({
				title: 'Não foi possível carregar os bolões',
				placement: 'top',
				bgColor: 'red.500',
			});
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Meus bolões" />
			<VStack
				mt={6}
				mx={5}
				borderBottomWidth={1}
				borderBottomColor="gray.600"
				pb={4}
				mb={4}
			>
				<Button
					onPress={() => navigate('find')}
					title="BUSCAR BOLÃO POR CÓDIGO"
					leftIcon={
						<Icon as={Octicons} name="search" color="black" size="md" />
					}
				/>
			</VStack>
			{isLoading ? (
				<Loading />
			) : (
				<FlatList
					data={pools}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<PoolCard
							data={item}
							onPress={() => navigate('details', { id: item.id })}
						/>
					)}
					ListEmptyComponent={EmptyPoolList}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{ pb: 10 }}
					px={5}
				/>
			)}
		</VStack>
	);
}
