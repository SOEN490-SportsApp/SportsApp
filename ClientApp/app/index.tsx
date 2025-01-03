import { Redirect } from 'expo-router';
global.Buffer = require('buffer').Buffer;

export default function Index() {
  return <Redirect href="/auth/login" />;
}
