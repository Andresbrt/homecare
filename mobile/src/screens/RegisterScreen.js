import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import appTheme from '../theme/theme';
import { API_BASE_URL } from '../config/api';

const RoleSelector = ({ selectedRole, onSelectRole }) => (
  <View style={styles.roleSelectorContainer}>
    <TouchableOpacity
      style={[
        styles.roleButton,
        selectedRole === 'CUSTOMER' && styles.roleButtonSelected,
      ]}
      onPress={() => onSelectRole('CUSTOMER')}
    >
      <Text
        style={[
          styles.roleButtonText,
          selectedRole === 'CUSTOMER' && styles.roleButtonTextSelected,
        ]}
      >
        Soy Cliente
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.roleButton,
        selectedRole === 'SERVICE_PROVIDER' && styles.roleButtonSelected,
      ]}
      onPress={() => onSelectRole('SERVICE_PROVIDER')}
    >
      <Text
        style={[
          styles.roleButtonText,
          selectedRole === 'SERVICE_PROVIDER' && styles.roleButtonTextSelected,
        ]}
      >
        Soy Profesional
      </Text>
    </TouchableOpacity>
  </View>
);

const DocumentPickerInput = ({ label, onPick, file, onClear }) => (
    <View style={styles.documentPickerContainer}>
      <Text style={styles.documentLabel}>{label}</Text>
      {file ? (
        <View style={styles.fileInfoContainer}>
          <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
          <TouchableOpacity onPress={onClear}>
            <Feather name="x-circle" size={20} color={appTheme.COLORS.darkGray} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.documentButton} onPress={onPick}>
          <Text style={styles.documentButtonText}>Seleccionar archivo</Text>
          <Feather name="upload" size={18} color={appTheme.COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

const RegisterScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');

  const [documents, setDocuments] = useState({
    idCard: null,
    backgroundCheck: null,
    photoWithIdCard: null,
    bankCertification: null,
  });

  const handlePickDocument = async (docType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });
      if (!result.canceled) {
        setDocuments(prev => ({ ...prev, [docType]: result.assets[0] }));
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo seleccionar el archivo.');
    }
  };

  const clearDocument = (docType) => {
    setDocuments(prev => ({ ...prev, [docType]: null }));
  };


  const validate = () => {
    const tempErrors = {};
    if (!firstName) tempErrors.firstName = 'El nombre es obligatorio.';
    if (!email) tempErrors.email = 'El correo es obligatorio.';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Correo no válido.';
    if (!password) tempErrors.password = 'La contraseña es obligatoria.';
    else if (password.length < 6) tempErrors.password = 'La contraseña debe tener al menos 6 caracteres.';

    if (selectedRole === 'SERVICE_PROVIDER') {
        if (!phoneNumber) tempErrors.phoneNumber = 'El número de celular es obligatorio.';
        if (!documents.idCard) tempErrors.idCard = 'La cédula es obligatoria.';
        if (!documents.backgroundCheck) tempErrors.backgroundCheck = 'Los antecedentes son obligatorios.';
        if (!documents.photoWithIdCard) tempErrors.photoWithIdCard = 'La foto con la cédula es obligatoria.';
        if (!documents.bankCertification) tempErrors.bankCertification = 'La certificación bancaria es obligatoria.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', selectedRole);

    if (selectedRole === 'SERVICE_PROVIDER') {
        formData.append('phoneNumber', phoneNumber);
        formData.append('verificationStatus', 'PENDING');

        Object.keys(documents).forEach(key => {
            if (documents[key]) {
                formData.append(key, {
                    uri: documents[key].uri,
                    name: documents[key].name,
                    type: documents[key].mimeType,
                });
            }
        });
    }

    try {
        const isJson = selectedRole === 'CUSTOMER';
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: isJson ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'multipart/form-data' },
            body: isJson ? JSON.stringify({ firstName, lastName, email, password, role: 'CUSTOMER' }) : formData,
        });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo completar el registro.');
      }

      if (selectedRole === 'CUSTOMER' && data.token) {
        await signIn({ token: data.token, user: data.user });
        Alert.alert('¡Bienvenido!', 'Tu cuenta ha sido creada exitosamente.');
      } else {
        Alert.alert(
            'Registro en Proceso',
            'Hemos recibido tus datos. Tu cuenta será revisada y activada pronto. Te notificaremos por correo.'
        );
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error de Registro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubtitle = () => {
    return selectedRole === 'CUSTOMER'
      ? 'Únete a CleanHome y simplifica tu vida.'
      : 'Forma parte de nuestro equipo de profesionales.';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

        <View style={styles.form}>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            placeholder="Nombre"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={appTheme.COLORS.darkGray}
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            placeholder="Apellido (Opcional)"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={appTheme.COLORS.darkGray}
          />

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={appTheme.COLORS.darkGray}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={appTheme.COLORS.darkGray}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {selectedRole === 'SERVICE_PROVIDER' && (
            <>
                <TextInput
                    style={[styles.input, errors.phoneNumber && styles.inputError]}
                    placeholder="Número de Celular"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    placeholderTextColor={appTheme.COLORS.darkGray}
                />
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

                <DocumentPickerInput
                    label="Cédula de Ciudadanía"
                    file={documents.idCard}
                    onPick={() => handlePickDocument('idCard')}
                    onClear={() => clearDocument('idCard')}
                />
                {errors.idCard && <Text style={styles.errorText}>{errors.idCard}</Text>}

                <DocumentPickerInput
                    label="Antecedentes (Judiciales, etc.)"
                    file={documents.backgroundCheck}
                    onPick={() => handlePickDocument('backgroundCheck')}
                    onClear={() => clearDocument('backgroundCheck')}
                />
                {errors.backgroundCheck && <Text style={styles.errorText}>{errors.backgroundCheck}</Text>}

                <DocumentPickerInput
                    label="Foto con la Cédula"
                    file={documents.photoWithIdCard}
                    onPick={() => handlePickDocument('photoWithIdCard')}
                    onClear={() => clearDocument('photoWithIdCard')}
                />
                {errors.photoWithIdCard && <Text style={styles.errorText}>{errors.photoWithIdCard}</Text>}

                <DocumentPickerInput
                    label="Certificación Bancaria"
                    file={documents.bankCertification}
                    onPick={() => handlePickDocument('bankCertification')}
                    onClear={() => clearDocument('bankCertification')}
                />
                {errors.bankCertification && <Text style={styles.errorText}>{errors.bankCertification}</Text>}
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={appTheme.COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Registrarme</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.h1,
    color: appTheme.COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.darkGray,
    marginTop: 8,
    textAlign: 'center',
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: appTheme.COLORS.secondary,
    borderRadius: 25,
    padding: 5,
    marginBottom: 30,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: appTheme.COLORS.primary,
    ...appTheme.SHADOWS.small,
    shadowColor: appTheme.COLORS.primary,
  },
  roleButtonText: {
    fontFamily: appTheme.FONTS.medium,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.darkGray,
  },
  roleButtonTextSelected: {
    color: appTheme.COLORS.white,
    fontFamily: appTheme.FONTS.semibold,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: appTheme.COLORS.secondary,
    borderRadius: 16,
    padding: 18,
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: appTheme.COLORS.gray,
    color: appTheme.COLORS.text,
  },
  inputError: {
    borderColor: appTheme.COLORS.red,
  },
  errorText: {
    color: appTheme.COLORS.red,
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: appTheme.FONTS.regular,
  },
  button: {
    backgroundColor: appTheme.COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    ...appTheme.SHADOWS.medium,
    shadowColor: appTheme.COLORS.primary,
  },
  buttonText: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.medium,
    color: appTheme.COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.darkGray,
  },
  footerLink: {
    fontFamily: appTheme.FONTS.semibold,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.primary,
    marginLeft: 5,
  },
  documentPickerContainer: {
    backgroundColor: appTheme.COLORS.secondary,
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: appTheme.COLORS.gray,
  },
  documentLabel: {
    fontFamily: appTheme.FONTS.medium,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.text,
    marginBottom: 10,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  documentButtonText: {
    fontFamily: appTheme.FONTS.regular,
    fontSize: appTheme.SIZES.font,
    color: appTheme.COLORS.primary,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileName: {
    fontFamily: appTheme.FONTS.regular,
    color: appTheme.COLORS.darkGray,
    flex: 1,
    marginRight: 10,
  },
});

export default RegisterScreen;
