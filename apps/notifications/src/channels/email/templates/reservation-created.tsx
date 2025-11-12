import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { ReservationCreatedParams } from '../interfaces';

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  border: '1px solid #eaeaea',
  borderRadius: '5px',
  margin: '40px auto',
  padding: '20px',
  width: '465px',
};

const heading = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: 'normal',
  textAlign: 'center' as const,
  margin: '30px 0',
  padding: 0,
};

const text = {
  color: '#000000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 15px 0',
};

export default function ReservationCreated(
  params: ReservationCreatedParams,
): React.JSX.Element {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your reservation has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            Your reservation has been confirmed! 🎉
          </Heading>
          <Text style={text}>Hello,</Text>
          <Text style={text}>
            Hello {params.name}, Your reservation has been successfully created.
            We're looking forward to hosting you!
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            The Sleepr Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
