#include <QtCore/QCoreApplication>
#include <QDebug>

#include <penguins.h>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString mStr = "Hello World";

    qDebug() << mStr;

    qDebug() << "Hello Testing";

    qDebug() << generate_penguin_fact().c_str();

    qDebug() << "Hello Again";

    return a.exec();
}