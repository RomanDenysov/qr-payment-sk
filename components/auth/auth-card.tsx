'use client';

import { ArrowLeft } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { FadeDiv, FadeSpan } from '../motion/fade';
import { Button } from '../ui/button';
import { EmailForm } from './email-form';
import { OtpForm } from './otp-form';

export type AuthState = 'prihlasenie' | 'registracia' | 'otp';

export function AuthCard() {
  const [authState, setAuthState] = useQueryState<AuthState>('status', {
    defaultValue: 'prihlasenie',
    history: 'push',
    shallow: true,
    parse: (value) => value as AuthState,
    serialize: (value) => value as AuthState,
  });
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (authState === 'otp' && !userEmail) {
      setAuthState('prihlasenie');
    }
  }, [authState, userEmail, setAuthState]);

  const handleBackToEmail = () =>
    setAuthState(authState === 'otp' ? 'prihlasenie' : 'prihlasenie');

  const getTitle = () => {
    switch (authState) {
      case 'prihlasenie':
        return 'Prihlásenie';
      case 'registracia':
        return 'Registrácia';
      case 'otp':
        return 'Overte váš email';
      default:
        return 'Prihlásenie';
    }
  };

  const getDescription = () => {
    switch (authState) {
      case 'prihlasenie':
        return 'Prihláste sa do svojho účtu';
      case 'registracia':
        return 'Vytvorte si nový účet';
      case 'otp':
        return `Zadajte 6-miestny kód, ktorý sme poslali na ${userEmail}`;
      default:
        return 'Prihláste sa do svojho účtu';
    }
  };

  return (
    <>
      <div className="flex flex-col gap-1 text-center">
        {authState === 'otp' && (
          <FadeDiv className="mb-4 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToEmail}
              className="h-auto p-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Späť
            </Button>
          </FadeDiv>
        )}

        <h1 className="font-bold text-3xl leading-none">
          <FadeSpan>{getTitle()}</FadeSpan>
        </h1>
        <p className="text-lg text-muted-foreground">
          <FadeSpan>{getDescription()}</FadeSpan>
        </p>

        {authState !== 'otp' && (
          <FadeDiv className="inline-flex items-center justify-center gap-1">
            {authState === 'prihlasenie' ? (
              <p className="text-muted-foreground text-sm">
                Nemáte účet?{' '}
                <button
                  type="button"
                  className="cursor-pointer text-primary underline"
                  onClick={() => setAuthState('registracia')}
                >
                  Zaregistrovať sa
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                Už máte účet?{' '}
                <button
                  type="button"
                  className="cursor-pointer text-primary underline"
                  onClick={() => setAuthState('prihlasenie')}
                >
                  Prihlásiť sa
                </button>
              </p>
            )}
          </FadeDiv>
        )}
      </div>
      {authState === 'otp' ? (
        <FadeDiv>
          {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
          <OtpForm userEmail={userEmail!} />
        </FadeDiv>
      ) : (
        <FadeDiv>
          <EmailForm
            setUserEmail={setUserEmail}
            authState={authState}
            setAuthState={setAuthState}
          />
        </FadeDiv>
      )}
    </>
  );
}
