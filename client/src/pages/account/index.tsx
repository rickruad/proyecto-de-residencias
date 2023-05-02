import * as Server from '@/hooks/Server';
import * as AuxiliarFunctions from '@/hooks/AuxiliarFunctions';

import Head from '@/components/Head';
import Header from '@/components/Header/Header';
import UserInfo from '@/components/Account/UserInfo';
import UsersInfo from '@/components/Account/UsersInfo';

export default function Account() {
  const { username, admin } = Server.GetCurrentUserInformation();

  return <>
    <Head title={`Cuenta de ${AuxiliarFunctions.firstWord({ text: `${AuxiliarFunctions.wordsToCapitalLetter({ text: username })}` })}`} />

    <Header />

    <UserInfo />

    {
      admin === 1 ?
        <UsersInfo />
        :
        null
    }
  </>
}