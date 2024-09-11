import React, { useState } from 'react';
import { Button, View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Canvas, useImage, Image as SkiaImage, Paint, ColorMatrix, Path, Circle } from '@shopify/react-native-skia';

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [filterApplied, setFilterApplied] = useState(false);

  // Função para abrir a galeria e selecionar uma imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setFilterApplied(false); // Redefine o estado quando uma nova imagem é carregada
    } else {
      Alert.alert('Seleção Cancelada', 'Nenhuma imagem foi selecionada.');
    }
  };

  // Função para aplicar o filtro de aumento de saturação
  const applyFilter = () => {
    setFilterApplied(true);
  };

  // Carrega a imagem selecionada para o Skia
  const skiaImage = useImage(imageUri);

  return (
    <View style={styles.container}>
      {/* Arco dos anéis olímpicos */}
      <Canvas style={styles.olympicRings}>
        {/* Cores dos anéis: Azul, Preto, Vermelho, Amarelo e Verde */}
        <Circle cx={50} cy={50} r={30} color="blue" style="stroke" strokeWidth={5} />
        <Circle cx={120} cy={50} r={30} color="black" style="stroke" strokeWidth={5} />
        <Circle cx={190} cy={50} r={30} color="red" style="stroke" strokeWidth={5} />
        <Circle cx={85} cy={90} r={30} color="yellow" style="stroke" strokeWidth={5} />
        <Circle cx={155} cy={90} r={30} color="green" style="stroke" strokeWidth={5} />
      </Canvas>

      <Text style={styles.title}>Editor de Imagens</Text>

      {imageUri && skiaImage ? (
        <Canvas style={styles.canvas}>
          <SkiaImage
            image={skiaImage}
            x={0}
            y={0}
            width={300}
            height={300}
            fit="contain"
          >
            {filterApplied && (
              <Paint>
                <ColorMatrix
                  matrix={[
                    2.0, 0, 0, 0, 0,
                    0, 2.0, 0, 0, 0,
                    0, 0, 2.0, 0, 0,
                    0, 0, 0, 1, 0,
                  ]}
                />
              </Paint>
            )}
          </SkiaImage>
        </Canvas>
      ) : (
        <Text style={styles.placeholder}>Nenhuma imagem selecionada</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Selecionar Imagem</Text>
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity style={[styles.button, styles.buttonApply]} onPress={applyFilter}>
            <Text style={styles.buttonText}>Aplicar Filtro</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  olympicRings: {
    position: 'absolute',
    top: 50,
    width: 250,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  canvas: {
    width: 300,
    height: 300,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonApply: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

